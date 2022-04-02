const fs = require("fs")
const path = require("path")


const name = "Hehe";

fs.opendir(`./${name}Project`, (err, dat) => {
            if (dat) {
                console.log(`A project already exists with the name ${name}Project`)
            } else {
                fs.mkdir(`${name}Project`, (err, data) => {})

                fs.appendFile(`./${name}Project/tsconfig.json`,
                    `
        {
            "compilerOptions": {
            "lib": [
                "es5",
                "es6"
                ],
            "target": "esnext",
            "module": "commonjs",
            "moduleResolution": "node",
            "outDir": "./build",
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "sourceMap": true,
                   
                }
        }
        `, (err, data) => {

                    })

                fs.appendFile(`./${name}Project/package.json`,
                    `{
                "name": "notes",
                "version": "0.0.1",
                "description": "Awesome project developed with TypeORM.",
                "devDependencies": {
                    "@types/bcrypt": "^5.0.0",
                    "@types/body-parser": "^1.19.1",
                    "@types/cors": "^2.8.12",
                    "@types/express": "^4.17.13",
                    "@types/geojson": "^7946.0.8",
                    "@types/jsonwebtoken": "^8.5.5",
                    "@types/node": "^16.11.4",
                    "@types/nodemailer": "^6.4.4",
                    "nodemon": "^2.0.14"
                },
                "dependencies": {
                    "bcrypt": "^5.0.1",
                    "body-parser": "^1.19.0",
                    "cors": "^2.8.5",
                    "dotenv": "^10.0.0",
                    "express": "^4.17.1",
                    "jsonwebtoken": "^8.5.1",
                    "nodemailer": "^6.7.2",
                    "pg": "^8.7.1",
                    "reflect-metadata": "^0.1.13",
                    "ts-node": "^10.1.0",
                    "typeorm": "^0.2.36",
                    "typescript": "^4.3.5",
                },
                "scripts": {
                    "start": "node build/index.js",
                    "start-dev": "ts-node src/index.ts",
                    "dev": "nodemon",
                    "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
                    "build": "tsc",
                    "mm": "npm run typeorm migration:generate -- -n Geos",
                    "mg": "npm run typeorm migration:run",
                    "build-prod": "cd client && npm install && npm run build && cd .. && npm install && npm run build",
                    "logs": "heroku logs --tail",
                    "restart": "heroku restart "
                }
            }
            
            `,
                    (err, data) => {

                    }
                )

                fs.appendFile(`./${name}Project/nodemon.json`, `{
            "watch": ["src"],
            "ext": ".ts",
            "ignore": [],
            "exec": "ts-node ./src/index.ts"
          }`, (err, dat) => {

                })

                fs.appendFile(`./${name}Project/.gitignore`, `.idea/
        .vscode/
        node_modules/
        tmp/
        temp/
        .env`, (err, dat) => {})

                fs.appendFile(`./${name}Project/.env`,
                    `PORT=7072
        ENVIRONMENT=debug
        SECRET=xzqp+k7gCzM*hK3]JCR6$Ha{SsO(u]_[{!vl$&oV?*H:J<h[zC2j:Gxm<C)S*Ct
        DATABASE_URL=postgres://"database_name":"database_password"@localhost:5432/${name}_database
    `, (err, dat) => {})

                fs.appendFile(`./${name}Project/ormconfig.js`,
                    `
const environment = process.env.ENVIRONMENT;
const ext = environment === "debug" ? "ts" : "js";
const app = environment === "debug" ? "src" : "build";

module.exports = {
    type: "postgres",
    port: 5432,
    url: process.env.DATABASE,
}


`, (err, dat) => {})
                fs.mkdir(`./${name}Project/src`, (err, data) => {
                    fs.appendFile(`./${name}Project/src/index.ts`, `
import "reflect-metadata";
import * as dotenv from "dotenv";

import ${name}App from "./${name.toLowerCase()}/${name.toLowerCase()}";
import MiddleWare from "./middleware/MiddleWare";

import { Routes } from "./routes";

dotenv.config();

${name}App.run({
  routes: Routes,
  middleware: new MiddleWare().apply(),
  port: process.env.PORT,
  // admin: Admin.register(AdminRoutes), 
  // docs: Docs.init().swagger(DocPages),
});

                `, (err, dat) => {

                    })

                })

                fs.mkdir(`./${name}Project/src/${name.toLowerCase()}`, (err, data) => {})
                fs.mkdir(`./${name}Project/src/middleware`, (err, data) => {})
                fs.mkdir(`./${name}Project/src/controller`, (err, data) => {})
                fs.mkdir(`./${name}Project/src/helpers`, (err, data) => {})
                fs.mkdir(`./${name}Project/src/entity`, (err, data) => {})
                fs.mkdir(`./${name}Project/src/migration`, (err, data) => {})

                fs.appendFile(`./${name}Project/src/helpers/createRoute.ts`, `
        export default function createRoute(
            m: string,
            r: string,
            c: any,
            a: string,
            p?: any
          ) {
            return {
              method: m,
              route: r,
              controller: c,
              action: a,
              perimissions: p,
              isAuthenticated: false
            };
          }          
                `, (err) => {
                    console.log(err)
                })

                fs.appendFile(`./${name}Project/src/helpers/registerRoutes.ts`, `
        export default function (routesArray: any[]) {
            return routesArray.reduce((p, c) => p.concat(c), [])
        }   `, (err) => {
                    console.log(err)
                })

                fs.appendFile(`./${name}Project/src/helpers/useTryCatch.ts`, `
export default async function useTryCatch(promise: Promise<any>) {
    try {
      return [await promise, null];
    } catch (e) {
      return [null, e];
    }
  }
        `, (err) => {
                    console.log(err)
                })

                fs.appendFile(`./${name}Project/src/helpers/generateModel.ts`,
                        `
            const fs = require("fs")
const path = require("path")

const EntityName = "User"

const columns = [{
        key: "party",
        nullable: false,
        type: "string"
    },
    { key: "station", nullable: true, type: "string" }
]

const relations = [{
        entity: "SurveyField",
        type: "OneToMany",
        columns: [{ key: "name", nullable: false, type: "string" }]
    }, {
        entity: "Table",
        type: "ManyToMany",
        columns: [{ key: "name", nullable: false, type: "string" }]
    }, {
        entity: "MediaTest",
        type: "ManyToOne",
        columns: [{ key: "name", nullable: false, type: "string" }]
    },
    {
        entity: "Profile",
        type: "OneToOne",
        columns: [{ key: "name", nullable: false, type: "string" }]
    }
]


function uniqueRelImports(value, index, self) {
    return self.indexOf(value) === index;
}


(fs.appendFile(\../entity/\${EntityName}.ts \`,
\`
import { Request, Response, NextFunction } from "express"
import createRoute from "../helpers/createRoute";
import useTryCatch from "../helpers/useTryCatch";
import { PrimaryGeneratedColumn, Entity, Column, getRepository $ { relations.map((p) => \`,\${p.type}\`).filter(uniqueRelImports).join("") }} from "typeorm"
\${ relations.map(m => \`import \${ m.entity } from "./\${m.entity}";\`).join(\`\`)}

@Entity() 
export default class \${ EntityName } {
    @PrimaryGeneratedColumn("uuid")
    id: string
    \${columns.map(c => \`@Column(\${ c.nullable ? \` { nullable: true }\` : "" }) \${ c.key }: \${ c.type }\`).join("\n")}\${ relations.map(m => \`
    @\${ m.type }(() => \${ m.entity }, \${ m.entity.toLowerCase() } => \${ m.entity.toLowerCase() }.\${ EntityName.toLowerCase() }) \${ m.entity.toLowerCase() }: \${ m.entity }
                        \${ m.type === "OneToMany" ? "[]" : m.type === "ManyToMany" ? "[]" : "" }\`).join("\n") } }

    class \${ EntityName }Controller {
            private \${ EntityName[0].toLowerCase() }
            R = getRepository($\{ EntityName });

            async save(req: Request, res: Response, next: NextFunction) {
                const [data, error] = await useTryCatch(this.$ { EntityName[0].toLowerCase() }
                    R.save(req.body));
                if (data) return data;
                else res.status(403).json(error);
            }

            async one(req: Request, res: Response, next: NextFunction) {
                const [data, error] = await useTryCatch(this.$ { EntityName[0].toLowerCase() }
                    R.findOne(req.params.id, $ {
                            relations.length ? \` {
                            relations: [\${ relations.map(r => \`
                            "\${r.entity.toLowerCase()}"
                            \`) }]
                            \`: ""
                        }
                    }))
            if (data) return data;
            else res.status(403).json(error);
        }

        async all(req: Request, res: Response, next: NextFunction) {
            const [data, error] = await useTryCatch(this.\${ EntityName[0].toLowerCase() }
                R.find(\$ {relations.length ? \` {relations: [\${ relations.map(r => \`"\${r.entity.toLowerCase()}"
                        \`) }]
                                \`: ""
                    }
                }))
        if (data) return data;
        else res.status(403).json(error);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const [data, error] = await useTryCatch(this.$ { EntityName[0].toLowerCase() }
            R.save(req.body))
        if (data) return data;
        else res.status(403).json(error);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const [$ { EntityName.toLowerCase() }, error] = await useTryCatch(this.$ { EntityName[0].toLowerCase() }
            R.findOne(req.params.id))
        const [data, err] = await useTryCatch(this.$ { EntityName[0].toLowerCase() }
            R.remove($ { EntityName.toLowerCase() }))
        if (data) return data;
        else res.status(403).json(error)
    }

}


export const \${ EntityName }
Routes = [
    createRoute("post", \${ '"' }/\${EntityName.toLowerCase()}\${'"'}, \${EntityName}Controller, "save"),
    createRoute("get", \${ '"' }/\${EntityName.toLowerCase()}\${'"'}, \${EntityName}Controller, "all"),
    createRoute("get", \$ { '"' }/\${EntityName.toLowerCase()}/:id\${ '"' }, \${ EntityName }Controller, "one"),
    createRoute("put", \${ '"' }/\${EntityName.toLowerCase()}\${'"'}, \${EntityName}Controller, "update"),
    createRoute("put", \${ '"' }/\${EntityName.toLowerCase()}/:id \${ '"' }, \${ EntityName}Controller, "delete"),]

            \`,
                                (err) => {
                                    console.log(err || \`\n\nCreate file \${ EntityName } Model "../entity/\${EntityName}.ts"
            \`)
                                }),
                            path)



                        function inverseRel(type) {
                            const dir = ({
                                OneToOne: "OneToOne",
                                ManyToOne: "OneToMany",
                                OneToMany: "ManyToOne",
                                ManyToMany: "ManyToMany"
                            })
                            return dir[type]
                        }

                        function inverseType(type) {
                            if (type === "ManyToOne" || type === "ManyToMany") {
                                return "[]"
                            }
                            return ""
                        }


                        for (let m of relations) {
                            console.log(\`
            Creating / Updating \${ m.entity } in "../entity/\${m.entity}.ts"
            \`)
                            fs.readFile(\`../entity/\${ m.entity }.ts \`, (err, data) => {
                                        if (data) {
                                            const ds = ((data.toString()))
                                            const dsArray = (ds.split("@"))
                                            const removed = dsArray.splice(dsArray.length - 1, 1)
                                            dsArray.push(\`
            \${ inverseRel(m.type) }(() => \${ EntityName }, \${ EntityName.toLowerCase() } => \${ EntityName.toLowerCase() }.\${ m.entity.toLowerCase() })\ r\n\${ EntityName.toLowerCase() }: \${ EntityName }
            \${ inverseType(m.type) }\
            r\n \`)
                                            const newData = (dsArray.concat(removed).join("@"))
                                            fs.writeFile(\`../entity/\${ m.entity }.ts \`, newData, (err, success) => {
                                                console.log(\`
            Update file \${ m.entity }.ts in "../entity/\${m.entity}.ts\`)

        })
}
else {
    fs.appendFile(\`../entity/\${m.entity}.ts\`, \`
import {PrimaryGeneratedColumn, Entity, Column, getRepository, \${inverseRel(m.type)} }from "typeorm"
import {Request, Response, NextFunction} from "express"
import createRoute from "../helpers/createRoute";
import useTryCatch from "../helpers/useTryCatch";
import \${EntityName} from "./\${EntityName}"
                    
@Entity()
export default class \${m.entity}{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    \${m.columns.map(c=>\`
    @Column(\${c.nullable? \`{nullable:true}\`:""})
    \${c.key}:\${c.type}
    \`).join(\`\n\`)}
    @\${inverseRel(m.type)}(()=>\${EntityName}, \${EntityName.toLowerCase()}=>\${EntityName.toLowerCase()}.\${m.entity.toLowerCase()})
    \${EntityName.toLowerCase()}: \${EntityName}\${inverseType(m.type)}
}
                 

export class \${m.entity}Controller{
    private \${m.entity[0].toLowerCase()}R = getRepository(\${EntityName});
                    
    async save(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.\${m.entity[0].toLowerCase()}R.save(req.body));
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async one(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.\${m.entity[0].toLowerCase()}R.findOne(req.params.id))
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async all(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.\${m.entity[0].toLowerCase()}R.find())
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async update(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.\${m.entity[0].toLowerCase()}R.save(req.body))
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async delete(req:Request, res:Response, next:NextFunction){
        const [\${m.entity.toLowerCase()}, error] = await useTryCatch(this.\${m.entity[0].toLowerCase()}R.findOne(req.params.id))
        const [data, err] = await useTryCatch(this.\${m.entity[0].toLowerCase()}R.remove(\${m.entity.toLowerCase()}))
        if(data) return data;
        else res.status(403).json(error);
    }
                    }
export const \${EntityName}Routes = [
    createRoute("post", ${'"'}/\${m.entity.toLowerCase()}${'"'}, \${m.entity}Controller, "save"),
    createRoute("get", ${'"'}/\${m.entity.toLowerCase()}${'"'}, \${m.entity}Controller, "all"),
    createRoute("get", ${'"'}/\${m.entity.toLowerCase()}/:id${'"'}, \${m.entity}Controller, "one"),
    createRoute("put", ${'"'}/\${m.entity.toLowerCase()}${'"'}, \${m.entity}Controller, "update"),
    createRoute("put", ${'"'}/\${m.entity.toLowerCase()}/:id${'"'}, \${m.entity}Controller, "delete"),
]
                \`, err=>{
                        console.log(\`Create file \${m.entity}.ts in "../entity/\${m.entity}.ts\`)                            })
                        }
                    
            });        

}
            `, (err) => {
                console.log(err)
            })

        fs.appendFile(`./${name}Project/src/${ name.toLowerCase() }/${name.toLowerCase()}.ts`, `
import { createConnection } from "typeorm";
import { Request, Response } from "express";

import * as express from "express";

export default class \${ name }App {

static run({ routes, admin, docs, middleware, port }: any): void {
    createConnection()
     .then(async(connection) => {
         const app = express();
         const http = require("http");
         const server = http.createServer(app)
         middleware.forEach((middleWare: any) => {
             app.use((req, res, next) => middleWare(req, res, next, { server, app }))})

                routes.concat(admin || []).concat(docs || []).forEach((route: any) => {
                    (app as any)[route.method](
                        route.route,
                        (req: Request, res: Response, next: Function) => {
                            const result = new(route.controller as any)()[route.action](
                                req,
                                res,
                                next
                            );
                            if (result instanceof Promise) {
                                result.then((result) =>
                                   result !== null && result !== undefined ?
                                    route.view ? res.sendFile(route.view) : res.send(result) :
                                    undefined
                                );
                            } else if (result !== null && result !== undefined) {
                                if (route.view) {
                                    res.sendFile(route.view);
                                                        } else {
                                    res.json(result)
                                   }
                               }
                        }
                    );
                });

                 app.get("/", (req, res) => {
                     res.json("index.html");
                });

                server.listen(port);

                 console.log("Server has started on port: " + process.env.PORT);
             })
              .catch((error) => console.log(error));

     }
}
 `, (err, dat) => {
            console.log(err)

        })

    }

})