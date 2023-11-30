const form = document.getElementById('registerform')
let entrylist = []
if (localStorage.getItem('entrylist') === null) {
  entrylist = []
  console.log('if')
} else {
  entrylist = JSON.parse(localStorage.getItem('entrylist')) 
  console.log("else")
}

const getentries = () => {
  let entries = localStorage.getItem('entrylist')
  if (entries) {
    entries=JSON.parse(entries) } else {
        entries=[]
    }
    return entries;
}
const display = ()=>{
let entries=getentries()
const table1 = entries.map((entry)=>{
const boxname = `<td class='border px-4 py-2'>${entry.FullName}</td>`
const boxemail = `<td class='border px-4 py-2'>${entry.email}</td>`
const boxpassword = `<td class='border px-4 py-2'>${entry.password}</td>`
const boxdob = `<td class='border px-4 py-2'>${entry.dob}</td>`
const boxaccept = `<td class='border px-4 py-2'>${entry.accept}</td>`
const row = `<tr>${boxname} ${boxemail} ${boxpassword} ${boxdob} ${boxaccept}</tr>`
return row

}).join('\n')
const table =` <table class='table-auto w-full'>
    <tr>
    <th class='px-4 py-2 '>Name </th>
    <th class='px-4 py-2 '>Email </th>
    <th class='px-4 py-2 '>Password </th>
    <th class='px-4 py-2 '>Dob </th>
    <th class='px-4 py-2 '>Accepted terms? </th>
    </tr>${table1}
</table>`
let userDetails = document.getElementById('valid_entries')
userDetails.innerHTML=table
}

const save = (event)=>{
event.preventDefault();
const FullName = document.getElementById('name').value
const email = document.getElementById('email').value
const password = document.getElementById('password').value
const dob = document.getElementById('dob').value
const accept = document.getElementById('check').checked
var currentYear = new Date().getFullYear();
var birthYear = dob.split("-");
let year=birthYear[0]
var age = currentYear-year
let alert1=document.getElementById('alert');
if(age < 18 || age > 55){
    
    alert1.textContent="The age has to be between 18 and 55";

}else{
    alert1.textContent="";
    const entry ={
        FullName,
        email,
        password,
        dob,
        accept
     }
     entrylist.push(entry);
     
     localStorage.setItem("entrylist",JSON.stringify(entrylist))
    display()
    form.reset()
   
}
 
}
form.addEventListener('submit',save)
display()