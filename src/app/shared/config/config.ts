export let Config = {

    security: {
        token: {
            endpoint: 'https://backoffice.corredors.cat:8443/auth/realms/BO-corredors.cat/protocol/openid-connect/token',
            storage: {
                provider: sessionStorage, // memoryStorage, sessionStorage, localStorage
                key: 'access_token',
                refreshKey: 'refresh_token'
            },
            header: {
                name: 'Authorization',
                prefix: 'Bearer ',
                globals: []
            },
            oidc: {
                clientId: 'users-management-console',
                clientCredentials: '574d0f48-7a6c-48fb-8a8b-dadc46cb9d16',
                grantType: 'password',
                refreshGrantType: 'refresh_token'
            },
        }
    },

    api: {
        members: {
            // base: 'http://localhost:8290/api',
            // base: 'https://82.98.146.11:8090/api',
            base: 'https://backoffice.corredors.cat:8090/api',
            list: '/?v=1&offset={offset}&limit={limit}',
            item: '/{id}?v=1',
            register: '/register/{id}?v=1',
            unregister: '/unregister/{id}?v=1',
            create: '/?v=1',
        },
        catalog: {
            // base: 'https://localhost:8290/cataleg',
			base: 'https://backoffice.corredors.cat:8090/cataleg',
            municipis: '/municipi/search?v=1&search=',
            municipisambCP: '/municipi/codipostal?v=1&codiPostal=',
            postalCodes: '/codipostal?v=1&municipi=',
        },
    },

    ui: {
        members: {
            list: {
                pageSize: 4
            }
        }
    }
};
