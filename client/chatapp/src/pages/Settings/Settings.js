import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalLink } from '~/components/Modals';

import { THEMES } from '~/constants';
import { setTheme } from '~/redux/reducers/themeSlice';

function Settings() {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const { t } = useTranslation();

    return (
        <ModalLink>
            <div className="mx-auto px-4 pt-20 max-w-5xl">
                <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-base-content">{t('settings.themeTitle')}</h2>
                        <p className="text-sm text-base-content/70">{t('settings.themeDescription')}</p>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {THEMES.map((t) => (
                            <button
                                key={t}
                                className={`
                                    group flex flex-col items-center gap-1.5 p-2 rounded-lg
                                    ${theme === t ? 'bg-base-100' : 'hover:bg-base-100/50'}
                                `}
                                data-set-theme={t}
                                onClick={() => dispatch(setTheme(t))}
                            >
                                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                    <div className="grid grid-cols-4 gap-px p-1 h-full">
                                        <div className="rounded bg-primary h-full" />
                                        <div className="rounded bg-secondary h-full" />
                                        <div className="rounded bg-accent h-full" />
                                        <div className="rounded bg-neutral h-full" />
                                    </div>
                                </div>
                                <span className="text-[11px] font-medium truncate w-full text-center text-base-content">
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </ModalLink>
    );
}

export default Settings;
