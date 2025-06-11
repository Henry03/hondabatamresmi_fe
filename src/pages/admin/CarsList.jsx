import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertToLocalDateTime, overlay, toRupiah } from "../../components/Utils";
import { Link, useSearchParams } from "react-router";
import HSOverlay from "@preline/overlay";
import ConfirmationModal from "../../components/ConfirmationModal";

function CarsList () {
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({})
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [errors, setErrors] = useState([]);
    const [id, setId] = useState('');
    const [mode, setMode] = useState(0);    // 0 for create, 1 for edit
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const start = (meta.page - 1) * meta.pageSize + 1;
    const end = Math.min(meta.page * meta.pageSize, meta.total);
    const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = searchParams.get("pageSize") || 10;
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    
    const getCarsList = () => {
        const input = {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder
        }

        axios.post('/api/v1/cars', input)
            .then(response => {
                console.log(response.data.data.data)
                setData(response.data.data.data)
                setMeta(response.data.data.meta)
                toast.success(response.data.message)
            })
            .catch(error => {
                console.error(error);
                toast.error(error.response.data.message)
            })
    }

    const createTag = (e) => {
        e.preventDefault();

        const input = {
            name,
            slug
        }

        const toastId = toast.loading("Creating new tag...");

        axios.post('/api/v1/tags/create', input)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                clearInput();
                getCarsList();
                new HSOverlay(document.querySelector('#tagModal')).close();
            })
            .catch(error => {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
    }

    const updateTag = () => {
        const input = {
            id,
            name,
            slug
        }

        const toastId = toast.loading("Updating tag...");

        axios.put(`/api/v1/tags`, input)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                clearInput();
                getCarsList();
                HSOverlay.close('#tagModal');
            })
            .catch(error => {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
        
    }

    const deleteCar = (e) => {
        const toastId = toast.loading("Deleting car...");

        axios.delete(`/api/v1/cars/${id}`)
            .then(response => {
                toast.success(response.data.message, {
                    id: toastId
                })
                setId('');
                getCarsList();
                overlay('#deleteCarModal').close();
            })
            .catch(error => {
                toast.error(error.response.data.message, {
                    id: toastId
                })
            })
    }

    const handleParams = (newState) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            Object.entries(newState).forEach(([key, value]) => {
                params.set(key, value);
            });
            return params;
        });
    };

    const clearInput = () => {
        setName('');
        setSlug('');
        setErrors([]);
    }

    const fillInput = (id, name, slug) => {
        setId(id);
        setName(name);
        setSlug(slug);
        setMode(1);
    }

    useEffect(()=> {
        getCarsList();
    }, [searchParams])

    return (
        <div className="m-2 sm:m-5">
            <div className="w-full">
                <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <form className="input max-w-xs" onSubmit={(e) => {
                            e.preventDefault();
                            handleParams({search})
                        }}>
                            <span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0"></span>
                            <input type="search" className="grow" placeholder="Search" id="leadingIconDefault" value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </form>
                        <select className="select w-fit appearance-none" aria-label="select" value={sortBy} onChange={(e) => handleParams({ sortBy: e.target.value })}>
                            <option value={'name'}>Name</option>
                            <option value={'slug'}>Slug</option>
                        </select>
                        <label className="swap swap-rotate">
                            <input 
                                type="checkbox" 
                                checked={sortOrder === "desc"}
                                onChange={() => handleParams({ sortOrder: sortOrder === "desc" ? "asc" : "desc" })}
                            />
                            <span className="swap-on icon-[tabler--sort-ascending] size-6 text-base-300"></span>
                            <span className="swap-off icon-[tabler--sort-descending] size-6 text-base-300"></span>
                        </label>
                    </div>
                    <button type="button" className="btn btn-primary"><Link to={'editor'}>Create</Link></button>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Variants</th>
                            <th>Price Range</th>
                            <th>Tags</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => (
                                <tr key={item.id}>
                                    <th> {(meta.page - 1) * 10 + index + 1} </th>
                                    <td>{item.name}</td>
                                    <td>{item.totalVariants}</td>
                                    <td>{`${toRupiah(item.minPrice)} - ${toRupiah(item.maxPrice)}`}</td>
                                    <td>{item.name}</td>
                                    <td className="flex gap-1">
                                        {
                                            item.tags.map(item => (
                                                <span key={item.idTag} className="badge badge-outline badge-primary rounded-full">{item.name}</span>
                                            ))
                                        }
                                    </td>
                                    <td>{convertToLocalDateTime(item.createdAt)}</td>
                                    <td>
                                        <Link className="btn btn-circle btn-text btn-sm" aria-label="Action button" to={`edit/${item.id}`}><span className="icon-[tabler--pencil] size-5"></span></Link>
                                        <button className="btn btn-circle btn-text btn-sm" aria-label="Action button" onClick={()=>{setId(item.id); HSOverlay.open('#deleteCarModal')}}><span className="icon-[tabler--trash] size-5"></span></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 py-4 pt-6">
                    <div className="me-2 max-w-sm text-sm text-base-content/80 sm:mb-0 flex gap-1">
                        Showing
                        <span className="font-semibold text-base-content/80">{start}</span>
                        to
                        <span className="font-semibold text-base-content/80">{end}</span>
                        of
                        <span className="font-semibold">{meta.total}</span>
                        tags
                    </div>

                    <nav className="join">
                        <button
                            type="button"
                            className="btn btn-soft btn-square join-item"
                            aria-label="previous button"
                            disabled={meta.page === 1}
                            onClick={() => handleParams({page: meta.page - 1})}
                        >
                        <span className="icon-[tabler--chevron-left] size-5 rtl:rotate-180"></span>
                        </button>

                        {pages.map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={`btn btn-soft join-item btn-square ${
                                p === meta.page ? "btn-active" : ""
                                }`}
                                aria-current={p === meta.page ? "page" : undefined}
                                onClick={() => handleParams({page: p})}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="btn btn-soft btn-square join-item"
                            aria-label="next button"
                            disabled={meta.page === meta.totalPages}
                            onClick={() => handleParams({page: meta.page + 1})}
                        >
                        <span className="icon-[tabler--chevron-right] size-5 rtl:rotate-180"></span>
                        </button>
                    </nav>
                    <select className="select w-fit appearance-none" aria-label="select" value={pageSize} onChange={(e) => handleParams({pageSize: e.target.value})}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={'all'}>All</option>
                    </select>
                </div>
            </div>
            <div id="tagModal" className="overlay modal modal-middle overlay-open:opacity-100 hidden" role="dialog" tabIndex="-1">
                <div className="modal-dialog overlay-open:opacity-100">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">User details</h3>
                        <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay="#tagModal"><span className="icon-[tabler--x] size-4" onClick={clearInput}></span></button>
                    </div>
                    <form onSubmit={
                        (e) =>{
                              e.preventDefault();
                            if (mode === 'create') {
                                createTag(e);
                            } else {
                                updateTag();
                            }
                        }
                    }>
                        <div className="modal-body pt-0">
                            <div className="">
                                <label className="label-text" htmlFor="tagNameField">Name</label>
                                <input type="text" placeholder="Electric" className={`input ${errors?.name && "is-invalid"}`} id="tagNameField" value={name} onChange={(e) => setName(e.target.value)} />
                                {
                                    errors?.name &&
                                    <span className="helper-text">{errors.name[0]}</span>
                                }
                            </div>
                            <div className="">
                                <label className="label-text" htmlFor="tagSlugField">Slug</label>
                                <input type="text" placeholder="electric" className={`input ${errors?.slug && "is-invalid"}`} id="tagSlugField" value={slug} onChange={(e) => setSlug(e.target.value)}/>
                                {
                                    errors?.slug &&
                                    <span className="helper-text">{errors.slug[0]}</span>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-soft btn-secondary" data-overlay="#tagModal" onClick={clearInput}>Close</button>
                        <button type="submit" className="btn btn-primary">{mode === 0 ? "Create" : "Save changes"}</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
            <ConfirmationModal 
                id={'deleteCarModal'}
                title={'Delete tag'}
                description={'Are you sure want to delete this car?'}
                onConfirm={deleteCar}
                btnType={'btn-primary'}
                btnText={'Delete'}
            />
        </div>
    )
}

export default CarsList;