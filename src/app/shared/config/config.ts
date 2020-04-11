import { SortOrder } from '../domain/datasource-page';
import { SearchOperator } from '../domain/search-criteria';

export let Config = {

    log: [
        {
            name: 'root',
            level: 'INFO',
            layout: {
                type: 'JsonLayout',
                params: {
                    readable: false,
                    combineMessages: false
                }
            },
            additivity: false,
            appenders: [
                'BrowserConsoleAppender'
            ]
        },
        {
            name: 'app',
            level: 'DEBUG',
            layout: {
                type: 'PatternLayout',
                params: {
                    pattern: '%d{HH:mm:ss} %-5p - %m%n'
                }
            },
            additivity: false,
            appenders: [
                'BrowserConsoleAppender'
            ]
        }
    ],

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
            check: {
                endpoint: 'https://backoffice.corredors.cat:8090/health/alive'
            }
        }
    },

    api: {
        catalog: {
            url: {
                // base: 'https://localhost:8290/cataleg',
                base: 'https://backoffice.corredors.cat:8090/cataleg',
                municipis: '/municipi/search?v=1&search=',
                municipisambCP: '/municipi/codipostal?v=1&codiPostal=',
                postalCodes: '/codipostal?v=1&municipi=',
            }
        },
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
                search: '/search?v=1&fields={fields}&offset={offset}&limit={limit}',
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
                    inconsistentNicks: 3,
                    notInForumGroup: 4,
                    inForumGroupButNotMember: 5,
                },
                operators: {
                    equals: { code: SearchOperator.EQ, desc: 'igual a' },
                    isnull: { code: SearchOperator.NULL, desc: 'és nul' },
                    in: { code: SearchOperator.IN, desc: 'pertany al conjunt' },
                    not: { code: SearchOperator.NOT, desc: 'no és' },
                    gt: { code: SearchOperator.GT, desc: 'més gran que' },
                    gte: { code: SearchOperator.GTE, desc: 'més gran o igual que' },
                    lt: { code: SearchOperator.LT, desc: 'més petit que' },
                    lte: { code: SearchOperator.LTE, desc: 'més petit o igual que' },
                    like: { code: SearchOperator.LIKE, desc: 'és semblant a' },
                    startsWith: { code: SearchOperator.STARTS_WITH, desc: 'comença per' },
                    endsWith: { code: SearchOperator.ENDS_WITH, desc: 'acaba amb' },
                    contains: { code: SearchOperator.CONTAINS, desc: 'conté' }
                },
                fields: {
                    nom: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    cognoms: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    nick: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    email: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    sexe: {
                        all: ['equals'],
                        default: 'equals'
                    },
                    nif: {
                        all: ['equals'],
                        default: 'equals'
                    },
                    iban: {
                        all: ['equals'],
                        default: 'equals'
                    },
                    telefon: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    adreca: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    codiPostal: {
                        all: ['equals'],
                        default: 'equals'
                    },
                    poblacio: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
                    activat: {
                        all: ['equals'],
                        default: 'equals'
                    },
                    quotaAlta: {
                        all: ['equals', 'gt', 'gte', 'lt', 'lte'],
                        default: 'equals'
                    },
                    dataAlta: {
                        all: ['equals', 'gt', 'gte', 'lt', 'lte'],
                        default: 'gte'
                    },
                    dataBaixa: {
                        all: ['equals', 'isnull', 'gt', 'gte', 'lt', 'lte'],
                        default: 'lte'
                    },
                    observacions: {
                        all: ['equals', 'like', 'startsWith', 'endsWith', 'contains'],
                        default: 'contains'
                    },
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
    },

    ui: {
        debounceTime: 50,
        members: {
            list: {
                debounceTime: 500,
                pageSize: 10,
                mobilePageSize: 7,
            }
        }
    }
};
