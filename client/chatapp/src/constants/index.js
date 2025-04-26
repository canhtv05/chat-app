import { CiSettings, CiUser } from 'react-icons/ci';
import { GrLanguage } from 'react-icons/gr';
const classNames = `size-7 mr-3`;

export const THEMES = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
];

export const MENU_ITEM_SETTINGS = ({ t, handleOpenProfile = () => {}, handleLanguage = () => {} }) => {
    return [
        {
            title: t('menu.accountInformation'),
            leftIcon: <CiUser className={classNames} />,
            onClick: handleOpenProfile,
        },
        {
            title: t('menu.settings'),
            leftIcon: <CiSettings className={classNames} />,
            separate: true,
            to: '/settings',
        },
        {
            title: t('menu.language'),
            leftIcon: <GrLanguage className="size-7 mr-3 scale-75 opacity-70 text-base" />,
            separate: true,
            submenu: [
                {
                    title: t('lang.vi'),
                    onClick: () => handleLanguage('vi'),
                    lang: 'vi',
                },
                {
                    title: t('lang.en'),
                    onClick: () => handleLanguage('en'),
                    lang: 'en',
                },
            ],
        },
        {
            title: t('menu.logout'),
        },
        {
            title: t('menu.exit'),
        },
    ];
};
