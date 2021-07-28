
export const convertTime = (timeEvent: any) => {
   return {
       day: new Date(timeEvent).getDate(),
       month: new Date(timeEvent).getMonth(),
       year: new Date(timeEvent).getFullYear(),

   }

}
export const convertTimeToMySQl = (timeEvent: any) => {
   return new Date(timeEvent).getFullYear()
   + "-" + (new Date(timeEvent).getMonth() +1)
   + "-" + new Date(timeEvent).getDate()
   + " " + new Date(timeEvent).getHours() 
   + ":" + new Date(timeEvent).getMinutes() 
   + ":" + new Date(timeEvent).getSeconds() 


}

export const formatDate = (oj: any) => {
   return oj.day + "/" + oj.month + "/" + oj.year;
}

// export const convertTimeToMySQL = (d : any) =>   {
//     if(0 <= d && d < 10) return "0" + d.toString();
//     if(-10 < d && d < 0) return "-0" + (-1*d).toString();
//     return d.toString();
// }