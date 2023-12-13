export interface User {
    first_name: string,
    last_name: string;
    avatar: string;
    location: string;
    title: string;
    description: string;
    tags: string;
    language: string;
    tfa_secret: string;
    email_notifications: true,
    appearance: string;
    theme_light: string;
    theme_light_overrides: string;
    theme_dark: string;
    theme_dark_overrides: string;
    status: string,
    role: {
        id: string;
        name: string;
        icon: string;
        description: string;
        ip_access: string;
        enforce_tfa: string;
        admin_access: string;
        app_access: string;
        users: string;
    },
    token: string;
    id: string;
    last_page: string;
    last_access: string;
    provider: string;
    external_identifier: string;
    auth_data: string;
    email: string;
    password: string;
    time: {
        id: string;
    }[],
    time_owner: [],
    status_tag: "ativo" | "ban";
    image: string;
}

