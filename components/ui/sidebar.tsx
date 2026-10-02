'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import {
    Blocks,
    Bot,
    BriefcaseBusiness,
    Cable,
    ChevronRight,
    FileCog,
    FolderKanban,
    Gauge,
    Radar,
    ScrollText,
    ShieldCheck,
    Tractor,
    Wrench,
} from 'lucide-react';

type NavItem = {
    href: string;
    label: string;
    shortLabel?: string;
    icon: ComponentType<{ size?: number; className?: string }>;
};

const coreItems: NavItem[] = [
    { href: '/about', label: 'О продукте', icon: Blocks },
    { href: '/panel', label: 'Панель управления', icon: Gauge },
    { href: '/projects', label: 'Проекты', icon: FolderKanban },
    { href: '/workspace', label: 'Инженерный контур', icon: Wrench },
    { href: '/documentation', label: 'Конструкторская документация', shortLabel: 'КД', icon: FileCog },
    { href: '/finance', label: 'НИОКР и финансирование', shortLabel: 'R&D', icon: BriefcaseBusiness },
    { href: '/ai', label: 'AI-проверки и рекомендации', shortLabel: 'AI', icon: Bot },
];

const serviceItems: NavItem[] = [
    { href: '/integrations', label: 'Интеграции', icon: Cable },
    { href: '/reports', label: 'Отчеты и журнал', icon: ScrollText },
    { href: '/admin', label: 'Администрирование', icon: ShieldCheck },
];

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
    const Icon = item.icon;
    const isActive =
        pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

    return (
        <Link
            href={item.href}
            className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
        >
      <span className="sidebar__link-icon">
        <Icon size={18} />
      </span>

            <span className="sidebar__link-main">
        <span className="sidebar__link-label">{item.label}</span>
                {item.shortLabel ? (
                    <span className="sidebar__link-badge">{item.shortLabel}</span>
                ) : null}
      </span>

            <ChevronRight size={14} className="sidebar__link-arrow" />
        </Link>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar__inner">
                {/* Бренд */}
                <div className="sidebar__brand">
                    <div className="sidebar__brand-icon">
                        <Tractor size={18} />
                    </div>
                    <div className="sidebar__brand-text">
                        <div className="sidebar__brand-title">TRACTORA AI</div>
                        <div className="sidebar__brand-subtitle">Платформа КБ и НИОКР</div>
                    </div>
                </div>

                {/* Статус */}
                <div className="sidebar__status">
                    <div className="sidebar__status-label">Статус системы</div>
                    <div className="sidebar__status-row">
                        <span className="sidebar__status-dot" />
                        <span className="sidebar__status-value">Демо-контур активен</span>
                    </div>
                </div>

                {/* Основные модули */}
                <div className="sidebar__section">
                    <div className="sidebar__section-title">Основные модули</div>
                    <nav className="sidebar__nav">
                        {coreItems.map((item) => (
                            <SidebarLink key={item.href} item={item} pathname={pathname} />
                        ))}
                    </nav>
                </div>

                {/* Служебные разделы */}
                <div className="sidebar__section sidebar__section--secondary">
                    <div className="sidebar__section-title">Служебные разделы</div>
                    <nav className="sidebar__nav">
                        {serviceItems.map((item) => (
                            <SidebarLink key={item.href} item={item} pathname={pathname} />
                        ))}
                    </nav>
                </div>

                {/* Операционный контур */}
                <div className="sidebar__ops">
                    <div className="sidebar__ops-header">
                        <Radar size={15} />
                        <span>Операционный контур</span>
                    </div>

                    <div className="sidebar__ops-grid">
                        <div className="sidebar__ops-item">
                            <span className="sidebar__ops-label">Режим</span>
                            <span className="sidebar__ops-value">Enterprise demo</span>
                        </div>

                        <div className="sidebar__ops-item">
                            <span className="sidebar__ops-label">Пилотный сценарий</span>
                            <span className="sidebar__ops-value">КБ / НИОКР / грант</span>
                        </div>

                        <div className="sidebar__ops-item">
                            <span className="sidebar__ops-label">Контур</span>
                            <span className="sidebar__ops-value">On-prem / SaaS-ready</span>
                        </div>
                    </div>

                    <p className="sidebar__ops-note">
                        Платформа ориентирована на конструкторские бюро, промышленные предприятия и команды цифровой
                        трансформации машиностроения.
                    </p>
                </div>
            </div>
        </aside>
    );
}