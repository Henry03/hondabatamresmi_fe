import { Outlet, useLocation } from "react-router";
import { useEffect } from 'react';

async function loadFlyonUI() {
    return import('flyonui/flyonui');
  }

function Layout() {
    const location = useLocation();

    useEffect(() => {
        const loadFlyonui = async () => {
          await import('flyonui/flyonui');
          window.HSStaticMethods.autoInit();
        };
        loadFlyonui();
      }, [location.pathname]);

    // useEffect(() => {
    //     const initFlyonUI = async () => {
    //       await loadFlyonUI();
    //     };
    
    //     initFlyonUI();
    // }, []);
    
    // useEffect(() => {
    //     setTimeout(() => {
    //       if (
    //         window.HSStaticMethods &&
    //         typeof window.HSStaticMethods.autoInit === 'function'
    //       ) {
    //         window.HSStaticMethods.autoInit();
    //       }
    //     }, 100);
    // }, [location.pathname]);

    return (
        <>
            <nav className="navbar rounded-box shadow-base-300/20 shadow-sm fixed">
                <div className="w-full md:flex md:items-center md:gap-2">
                    <div className="flex items-center justify-between">
                        <div className="navbar-start items-center justify-between w-full">
                            <a className="link text-base-content link-neutral text-xl font-bold no-underline whitespace-nowrap" href="#">Honda Taman Kota</a>
                            <div className="md:hidden">
                            <button type="button" className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square" data-collapse="#dropdown-navbar-collapse" aria-controls="dropdown-navbar-collapse" aria-label="Toggle navigation" >
                                <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
                                <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
                            </button>
                            </div>
                        </div>
                    </div>
                    <div id="dropdown-navbar-collapse" className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full" >
                        <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Services</a></li>
                            <li className="dropdown relative inline-flex [--auto-close:inside] [--offset:9] [--placement:bottom-end]">
                            <button id="dropdown-nav" type="button" className="dropdown-toggle dropdown-open:bg-base-content/10 dropdown-open:text-base-content" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown" >
                                Products
                                <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
                            </button>
                            <ul className="dropdown-menu dropdown-open:opacity-100 hidden" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-nav" >
                                <li><a className="dropdown-item" href="#">UI kits</a></li>
                                <li><a className="dropdown-item" href="#">Templates</a></li>
                                <li><a className="dropdown-item" href="#">Component library</a></li>
                                <hr className="border-base-content/25 -mx-2" />
                                <li><a className="dropdown-item" href="#">Figma designs</a></li>
                            </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
            <script src="../../node_modules/flyonui/dist/index.js"></script>
        </>
    )
}

export default Layout;