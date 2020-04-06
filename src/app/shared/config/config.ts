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
            url: {
                // base: 'https://localhost:8290/api',
                // base: 'https://82.98.146.11:8090/api',
                base: 'https://backoffice.corredors.cat:8090/api',
                list: '/?v=1&offset={offset}&limit={limit}',
                item: '/{id}?v=1',
                register: '/register/{id}?v=1',
                unregister: '/unregister/{id}?v=1',
                create: '/?v=1',
                nick: '/nick?v=1&nick=',
                email: '/email?v=1&email=',
                verify: '/consistency?v=1&nick={nick}&email={email}',
                verifiedNicks: '/consistency/nicks?v=1',
                verifiedMails: '/consistency/emails?v=1',
                search: '/search?v=1&fields={fields}&search={search}&offset={offset}&limit={limit}',
                export: '/export?v=1&queryType={queryType}',
                ready: '/export/ready?v=1&file=',
                live: '/export/live?v=1',
                download: '/download?v=1&file=',
            },

            query: {
                type: {
                    all: 0,
                    search: 1,
                    inconsistentEmails: 2,
                    inconsistentNicks: 3
                },
                operators: {
                    equals: { code: 'EQ', desc: 'igual a' },
                    isnull: { code: 'NULL', desc: 'és nul' },
                    in: { code: 'IN', desc: 'pertany al conjunt' },
                    not: { code: 'NOT', desc: 'no és' },
                    gt: { code: 'GT', desc: 'més gran que' },
                    gte: { code: 'GTE', desc: 'més gran o igual que' },
                    lt: { code: 'LT', desc: 'més petit que' },
                    lte: { code: 'LTE', desc: 'més petit o igual que' },
                    like: { code: 'LIKE', desc: 'és semblant a' },
                    startsWith: { code: 'STARTS_WITH', desc: 'comença per' },
                    endsWith: { code: 'ENDS_WITH', desc: 'acaba amb' },
                    contains: { code: 'CONTAINS', desc: 'conté' }
                },
                fields: {
                    nom: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    cognoms: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    nick: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    email: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    sexe: ['equals'],
                    nif: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    iban: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    telefon: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    adreca: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    codiPostal: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    poblacio: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                    activat: ['equals'],
                    quotaAlta: ['equals', 'gt', 'gte', 'lt', 'lte'],
                    dataAlta: ['equals', 'gt', 'gte', 'lt', 'lte'],
                    dataBaixa: ['equals', 'isnull', 'gt', 'gte', 'lt', 'lte'],
                    observacions: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                }
            },

            map: {
                H: 'Home',
                D: 'Dona',
                A: 'Altre',
                true: 'Sí',
                false: 'No'
            },

            downloadFileName: 'associats.csv'
        },
        catalog: {
            url: {
                // base: 'https://localhost:8290/cataleg',
                base: 'https://backoffice.corredors.cat:8090/cataleg',
                municipis: '/municipi/search?v=1&search=',
                municipisambCP: '/municipi/codipostal?v=1&codiPostal=',
                postalCodes: '/codipostal?v=1&municipi=',
            }
        },
    },

    ui: {
        debounceTime: 50,
        members: {
            list: {
                debounceTime: 500,
                pageSize: 4
            }
        }
    }
};
