import { Container } from "unstated";

class LayoutContainer extends Container {
    
    constructor() {
        super();
        this.state = {
            layoutType: "vertical",
            layoutWidth: "fluid",
            leftSideBarTheme: "dark",
            leftSideBarType: "default",
            topbarTheme: "light",
            isPreloader: false,
            showRightSidebar: false,
            isMobile: false,
            showSidebar : true,
            leftMenu : false
        }

        this.changeLayout({ payload: this.state.layoutType});
        this.changeLayoutWidth({ payload: this.state.layoutWidth});
        this.changeLeftSidebarTheme({ payload:  this.state.leftSideBarTheme});
        this.changeLeftSidebarType({ payload: {
            sidebarType: this.state.leftSideBarType,
            isMobile: this.state.isMobile
        }});
        this.changeTopbarTheme({ payload: this.state.topbarTheme });
    }


    _changeLayout = layout => {
        this.setState({...this.state, layoutType: layout});
    }
    
    _changePreloader = layout => {
        this.setState({...this.state, isPreloader: layout});
    }
    
    _changeLayoutWidth = width => {
        this.setState({...this.state, layoutWidth: width});
    }
    
    _changeSidebarTheme = theme => {
        this.setState({...this.state, leftSideBarTheme: theme});
    }
    
    _changeSidebarType = (sidebarType, isMobile) => {
        this.setState({...this.state, isMobile, leftSideBarType: sidebarType});
    };
    
    _changeTopbarTheme = topbarTheme => {
        this.setState({...this.state, topbarTheme});
    }
    
    _showSidebar = (isopen) => {
        this.setState({...this.state, showSidebar: isopen});
    }
    
    _toggleLeftmenu = (isopen) => {
        this.setState({...this.state, leftMenu: isopen});
    }
    

    changeBodyAttribute = (attribute, value) => {
        console.log("set attribute");
        if (document.body) document.body.setAttribute(attribute, value);
        return true;
    }

    manageBodyClass = (cssClass, action = "toggle") => {
        switch (action) {
            case "add":
                if (document.body) document.body.classList.add(cssClass);
                break;
            case "remove":
                if (document.body) document.body.classList.remove(cssClass);
                break;
            default:
                if (document.body) document.body.classList.toggle(cssClass);
                break;
        }
    
        return true;
    }

    changeLayout = ({ payload: layout }) => {
        try {
            if (layout === 'horizontal') {
                this.changeTopbarThemeAction('dark');
                document.body.removeAttribute('data-sidebar');
                document.body.removeAttribute('data-sidebar-size');
            } else {
                this.changeTopbarThemeAction('light')
            }
            this.changeBodyAttribute("data-layout", layout);
    
        } catch (error) { }
    }

    changeLayoutWidth = ({ payload: width }) => {
        try {
            if (width === 'boxed') {
                this.changeSidebarTypeAction("icon");
            } else {
                this.changeSidebarTypeAction("default");
            }
            this.changeBodyAttribute("data-layout-size", width)
        } catch (error) { }
    }

    changeLeftSidebarTheme = ({ payload: theme }) => {
        try {
            this.changeBodyAttribute("data-sidebar", theme);
        } catch (error) { }
    }

    changeTopbarTheme({ payload: theme }) {
        try {
            this.changeBodyAttribute("data-topbar", theme);
        } catch (error) { }
    }

    changeLeftSidebarType({ payload: { sidebarType, isMobile } }) {
        try {
            switch (sidebarType) {
                case "compact":
                    this.changeBodyAttribute("data-sidebar-size", "small");
                    this.manageBodyClass("sidebar-enable", "remove");
                    this.manageBodyClass("vertical-collpsed", "remove");
                    break;
                case "icon":
                    this.changeBodyAttribute("data-keep-enlarged", "true");
                    this.manageBodyClass("vertical-collpsed", "add");
                    break;
                case "condensed":
                    this.manageBodyClass( "sidebar-enable", "add");
                    if (!isMobile) this.manageBodyClass("vertical-collpsed", "add");
                    break;
                default:
                    this.changeBodyAttribute("data-sidebar-size", "");
                    this.manageBodyClass("sidebar-enable", "remove");
                    if (!isMobile) this.manageBodyClass("vertical-collpsed", "remove");
                    break;
            }
        } catch (error) { }
    }

    showRightSidebar = () => {
        try {
            this.manageBodyClass("right-bar-enabled", "add");
        } catch (error) { }
    }

}

export { LayoutContainer }