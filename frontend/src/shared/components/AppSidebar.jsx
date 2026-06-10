import { NavLink } from "react-router-dom";

function SidebarLink({ to, end, children, accent = "cyan" }) {
    const active =
        accent === "fuchsia"
            ? "border-fuchsia-500/30 bg-fuchsia-500/10 ui-text-primary"
            : "border-cyan-500/30 bg-cyan-500/10 ui-text-primary";
    const idle =
        "border-transparent ui-text-muted hover:border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:ui-text-primary";

    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm font-semibold transition-all duration-200 ${isActive ? active : idle}`
            }
        >
            {children}
        </NavLink>
    );
}

function SidebarSection({ title, children }) {
    return (
        <div>
            {title ? (
                <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {title}
                </p>
            ) : null}
            <nav className="flex flex-col gap-0.5">{children}</nav>
        </div>
    );
}

export { SidebarLink, SidebarSection };
