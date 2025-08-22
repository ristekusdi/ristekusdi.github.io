export default {
    title: 'Ristek USDI',
    description: 'Riset Teknologi Unit Sumber Daya Informasi. Berdikari dan Tangguh!',
    themeConfig: {
        siteTitle: 'Ristek USDI',
        nav: [
            { text: 'Panduan', link: '/guide/introduction' },
            { text: 'Pustaka', link: '/libraries/introduction' },
        ],
        sidebar: {
            '/guide/': { base: '/guide/', items: sidebarGuide() },
            '/libraries/': { base: '/libraries/', items: sidebarLibraries() },
        },
        search: {
            provider: 'local'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/ristekusdi' }
        ]
    },
    // deployment
    base: '/',
    cleanUrls: true,
}

function sidebarGuide() {
    return [
        {
            text: 'Panduan',
            items: [
                { text: 'Pengantar', link: 'introduction' },
                { text: 'Membuat Pustaka', link: 'create-package' },
            ]
        }
    ]
}

function sidebarLibraries() {
    return [
        {
            text: 'Pustaka',
            items: [
                { text: 'Pengantar', link: 'introduction' },
                { text: 'SSO PHP', link: 'sso-php' },
                { text: 'SSO Laravel', link: 'sso-laravel' },
                { text: 'Kisara', link: 'kisara-php' },
            ]
        }
    ]
}