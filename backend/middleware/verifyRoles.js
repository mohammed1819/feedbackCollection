const verifyRoles = (...allowedRoles) =>{
    return (req,res,next) => {
        if(!req?.roles){
            return res.status(401).json({message:'Roles are required'})
        }
        const allowedRolesArray = [...allowedRoles]
        const result = req.roles.map((role)=>allowedRolesArray.includes(role)).find(val=>val===true)
        if(!result){
            return res.status(403).json({message:'You are not authorized for accessing this resource'})
        }
        next()
    }
}

module.exports = verifyRoles