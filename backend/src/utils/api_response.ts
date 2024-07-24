export class ApiResponse{
    statusCode:number
    message:string
    nbhits:number
    success:boolean=true
    data:any
    constructor(statusCode:number,data:any, message:string="success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message

        if(!data){
            this.nbhits=0
        }else{
            if(Array.isArray(data)){
                this.nbhits=data.length
            }else{
                this.nbhits=1
            }
        }
    }

}