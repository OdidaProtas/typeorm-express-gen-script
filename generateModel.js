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


(fs.appendFile(`../entity/${EntityName}.ts`,
        `
import {Request, Response, NextFunction} from "express"
import createRoute from "../helpers/createRoute";
import useTryCatch from "../helpers/useTryCatch";
import {PrimaryGeneratedColumn, Entity, Column, getRepository ${relations.map((p )=>`,${p.type}`).filter(uniqueRelImports).join("")}} from "typeorm"

${relations.map(m=>`import  ${m.entity}  from "./${m.entity}";
`).join(``)}

@Entity()
export default class ${EntityName}{
    @PrimaryGeneratedColumn("uuid")
    id:string
    ${columns.map(c=>`
    @Column(${c.nullable? `{nullable:true}`:""})
    ${c.key}:${c.type}
    `).join("\n")}
    ${relations.map(m=>`
    @${m.type}(()=>${m.entity}, ${m.entity.toLowerCase()}=>${m.entity.toLowerCase()}.${EntityName.toLowerCase()})
    ${m.entity.toLowerCase()}: ${m.entity}${m.type === "OneToMany"? "[]": m.type==="ManyToMany" ? "[]": ""}
    `).join("\n")}
}

class ${EntityName}Controller{
    private ${EntityName[0].toLowerCase()}R = getRepository(${EntityName});

    async save(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.save(req.body));
        if(data) return data;
        else res.status(403).json(error);
    }

    async one(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.findOne(req.params.id, ${relations.length? `{relations:[${relations.map(r=>`"${r.entity.toLowerCase()}"`)}]`:""}}))
        if(data) return data;
        else res.status(403).json(error);
    }

    async all(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.find(${relations.length? `{relations:[${relations.map(r=>`"${r.entity.toLowerCase()}"`)}]`:""}}))
        if(data) return data;
        else res.status(403).json(error);
    }

    async update(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.save(req.body))
        if(data) return data;
        else res.status(403).json(error);
    }

    async delete(req:Request, res:Response, next:NextFunction){
        const [${EntityName.toLowerCase()}, error] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.findOne(req.params.id))
        const [data, err] = await useTryCatch(this.${EntityName[0].toLowerCase()}R.remove(${EntityName.toLowerCase()}))
        if(data) return data;
        else res.status(403).json(error)
    }
    
}


export const ${EntityName}Routes = [
    createRoute("post", ${'"'}/${EntityName.toLowerCase()}${'"'}, ${EntityName}Controller, "save"),
    createRoute("get", ${'"'}/${EntityName.toLowerCase()}${'"'}, ${EntityName}Controller, "all"),
    createRoute("get", ${'"'}/${EntityName.toLowerCase()}/:id${'"'}, ${EntityName}Controller, "one"),
    createRoute("put", ${'"'}/${EntityName.toLowerCase()}${'"'}, ${EntityName}Controller, "update"),
    createRoute("put", ${'"'}/${EntityName.toLowerCase()}/:id${'"'}, ${EntityName}Controller, "delete"),
]

`, (err) => {
        console.log(err || `\n\nCreate file ${EntityName} Model  "../entity/${EntityName}.ts"`)
    }), path)



    function inverseRel(type){
        const dir =  ({
            OneToOne:"OneToOne",
            ManyToOne:"OneToMany",
            OneToMany:"ManyToOne",
            ManyToMany:"ManyToMany"
        })
        return dir[type]
    }

    function inverseType(type){
        if(type === "ManyToOne"|| type=== "ManyToMany"){
            return "[]"
        }
        return ""
    }


for (let m of relations){
    console.log(`Creating / Updating  ${m.entity} in "../entity/${m.entity}.ts"`)
            fs.readFile(`../entity/${m.entity}.ts`, (err, data)=>{
                if(data){
                    const ds = ((data.toString()))
                    const dsArray = (ds.split("@"))
                    const removed = dsArray.splice(dsArray.length - 1, 1)
                    dsArray.push(`${inverseRel(m.type)}(()=>${EntityName}, ${EntityName.toLowerCase()}=>${EntityName.toLowerCase()}.${m.entity.toLowerCase()})\r\n${EntityName.toLowerCase()}: ${EntityName}${inverseType(m.type)}\r\n`)
                    const newData  = (dsArray.concat(removed).join("@"))
                    fs.writeFile(`../entity/${m.entity}.ts`, newData, (err, success)=>{
                        console.log(`Update file ${m.entity}.ts in "../entity/${m.entity}.ts`)

                    })
                }else{
                    fs.appendFile(`../entity/${m.entity}.ts`, `
import {PrimaryGeneratedColumn, Entity, Column, getRepository, ${inverseRel(m.type)} }from "typeorm"
import {Request, Response, NextFunction} from "express"
import createRoute from "../helpers/createRoute";
import useTryCatch from "../helpers/useTryCatch";
import ${EntityName} from "./${EntityName}"
                    
@Entity()
export default class ${m.entity}{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    ${m.columns.map(c=>`
    @Column(${c.nullable? `{nullable:true}`:""})
    ${c.key}:${c.type}
    `).join(`\n`)}
    @${inverseRel(m.type)}(()=>${EntityName}, ${EntityName.toLowerCase()}=>${EntityName.toLowerCase()}.${m.entity.toLowerCase()})
    ${EntityName.toLowerCase()}: ${EntityName}${inverseType(m.type)}
}
                 

export class ${m.entity}Controller{
    private ${m.entity[0].toLowerCase()}R = getRepository(${EntityName});
                    
    async save(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${m.entity[0].toLowerCase()}R.save(req.body));
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async one(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${m.entity[0].toLowerCase()}R.findOne(req.params.id))
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async all(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${m.entity[0].toLowerCase()}R.find())
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async update(req:Request, res:Response, next:NextFunction){
        const [data, error] = await useTryCatch(this.${m.entity[0].toLowerCase()}R.save(req.body))
        if(data) return data;
        else res.status(403).json(error);
    }
                    
    async delete(req:Request, res:Response, next:NextFunction){
        const [${m.entity.toLowerCase()}, error] = await useTryCatch(this.${m.entity[0].toLowerCase()}R.findOne(req.params.id))
        const [data, err] = await useTryCatch(this.${m.entity[0].toLowerCase()}R.remove(${m.entity.toLowerCase()}))
        if(data) return data;
        else res.status(403).json(error);
    }
                    }
export const ${EntityName}Routes = [
    createRoute("post", ${'"'}/${m.entity.toLowerCase()}${'"'}, ${m.entity}Controller, "save"),
    createRoute("get", ${'"'}/${m.entity.toLowerCase()}${'"'}, ${m.entity}Controller, "all"),
    createRoute("get", ${'"'}/${m.entity.toLowerCase()}/:id${'"'}, ${m.entity}Controller, "one"),
    createRoute("put", ${'"'}/${m.entity.toLowerCase()}${'"'}, ${m.entity}Controller, "update"),
    createRoute("put", ${'"'}/${m.entity.toLowerCase()}/:id${'"'}, ${m.entity}Controller, "delete"),
]
                     `, err=>{
                        console.log(`Create file ${m.entity}.ts in "../entity/${m.entity}.ts`)

                            })
                        }
                    
            });        

}