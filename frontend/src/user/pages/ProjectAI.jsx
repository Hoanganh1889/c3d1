/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { getProjectInsight, getProjectPerformance } from "../../services/projectService";
import { useI18n } from "../../shared/i18n/useI18n";
import { WorkspaceErrorState, WorkspaceLoadingState } from "../components/WorkspaceStateView";
import { WorkspacePanel } from "../components/WorkspacePageShell";

function ProjectAI() {
    const { t } = useI18n();
    const { project } = useOutletContext();
    const [state, setState] = useState({ loading: true, error: null, insight: null, performance: null });

    const load = async () => {
        setState({ loading: true, error: null, insight: null, performance: null });

        try {
            const [insight, performance] = await Promise.all([
                getProjectInsight(project.id),
                getProjectPerformance(project.id),
            ]);
            setState({ loading: false, error: null, insight, performance });
        } catch (error) {
            setState({ loading: false, error, insight: null, performance: null });
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id]);

    if (state.loading) {
        return (
            <WorkspaceLoadingState
                title={t("project.ai.loadingTitle")}
                description={t("project.ai.loadingDesc")}
            />
        );
    }

    if (state.error) {
        return (
            <WorkspaceErrorState
                title={t("project.ai.errorTitle")}
                message={t("project.ai.errorDesc")}
                status={state.error?.response?.status}
                onRetry={load}
            />
        );
    }

    const insight = state.insight;
    const performance = state.performance;

    return (
        <div className="ui-page">
            <section className="ui-panel">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            {t("tasks.aiInsight")}
                        </p>
                        <h1 className="ui-text-primary mt-1 text-xl font-bold">
                            {project.projectName}
                        </h1>
                        <p className="ui-page-desc">
                            {t("project.ai.desc")}
                        </p>
                    </div>

                    <div className="ui-card">
                        <p className="ui-text-faint text-[10px] font-bold uppercase tracking-wider">
                            {t("project.ai.nextAction")}
                        </p>
                        <h2 className="ui-text-primary mt-1 text-sm font-semibold leading-5">
                            {insight.nextAction || performance.nextAction}
                        </h2>
                    </div>
                </div>
            </section>

            <section className="ui-stat-grid">
                <Mini label={t("project.performance.completion")} value={insight.health || performance.health} />
                <Mini label={t("project.ai.summary")} value={insight.focus || performance.focus} />
                <Mini
                    label={t("project.performance.completion")}
                    value={`${performance.completionRate?.toFixed?.(1) ?? performance.completionRate}%`}
                />
                <Mini label={t("project.room.statsMembers")} value={performance.memberCount} />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
                <WorkspacePanel title={t("project.ai.summary")} subtitle={t("project.ai.desc")}>
                    <div className="space-y-2">
                        <div className="ui-card">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                                {t("project.ai.summary")}
                            </p>
                            <p className="ui-text-primary mt-2 text-sm leading-6">{insight.summary}</p>
                        </div>
                        <div className="ui-card">
                            <p className="ui-text-faint text-[10px] font-bold uppercase tracking-wider">
                                {t("project.ai.title")}
                            </p>
                            <p className="ui-text-muted mt-2 text-sm leading-6">{insight.context}</p>
                        </div>
                    </div>
                </WorkspacePanel>

                <WorkspacePanel title={t("project.performance.title")} subtitle={t("nav.performance")}>
                    <div className="space-y-3">
                        {performance.signals.map((signal) => (
                            <div key={signal} className="ui-card">
                                <p className="ui-text-primary text-sm leading-6">{signal}</p>
                            </div>
                        ))}
                    </div>
                </WorkspacePanel>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <WorkspacePanel title={t("project.ai.summary")} subtitle={t("project.ai.nextAction")}>
                    <div className="space-y-3">
                        {insight.highlights.map((item) => (
                            <div
                                key={item}
                                className="ui-card text-sm leading-6"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </WorkspacePanel>

                <WorkspacePanel title={t("project.ai.nextAction")} subtitle={t("project.ai.desc")}>
                    <div className="space-y-3">
                        {insight.recommendations.map((item) => (
                            <div
                                key={item}
                                className="ui-card text-sm leading-6"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </WorkspacePanel>
            </section>

            <div className="flex flex-wrap justify-between gap-3">
                <Link
                    to="performance"
                    className="ui-btn-primary"
                >
                    <Sparkles size={16} />
                    {t("nav.performance")}
                </Link>
                <Link
                    to={`/project/${project.id}/tasks`}
                    className="ui-btn-ghost"
                >
                    <Bot size={16} />
                    {t("project.room.tasksLink")}
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

function Mini({ label, value }) {
    return (
        <div className="ui-stat-card">
            <p className="ui-text-faint text-[10px] font-bold uppercase tracking-wider">{label}</p>
            <h3 className="ui-text-primary mt-0.5 text-lg font-bold">{value}</h3>
        </div>
    );
}

export default ProjectAI;
