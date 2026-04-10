/* =========================
ONBOARDING CHECK
========================= */

const onboardingComplete = localStorage.getItem("onboardingComplete")
const onboarding = document.getElementById("onboarding")

if(onboardingComplete === "true"){
if(onboarding) onboarding.style.display = "none"
}

/* SUPABASE */

const SUPABASE_URL = "https://qjihbbkllgclbezigblr.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaWhiYmtsbGdjbGJlemlnYmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTkyNjgsImV4cCI6MjA4OTA3NTI2OH0.oFJgCngNrYPlQbjQI8S9g-zYBqFEjDzBvzWIfzwUUZc"

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
)

document.fonts.ready.then(() => {
document.querySelectorAll(".material-symbols-sharp")
.forEach(icon => icon.style.opacity = "1")
})

/* =========================
DATA STORAGE
========================= */

let transactions = JSON.parse(localStorage.getItem("transactions")) || []
let budgets = JSON.parse(localStorage.getItem("budgets")) || []
let goals = JSON.parse(localStorage.getItem("goals")) || []
let currency = localStorage.getItem("currency") || "₹"

/* =========================
ELEMENTS
========================= */

const modal = document.getElementById("transactionModal")
const openBtn = document.getElementById("addTransactionBtn")
const closeBtn = document.getElementById("closeTransactionModal")
const cancelBtn = document.getElementById("cancelTransaction")
const fabBtn = document.getElementById("fabAddTransaction")

const balanceEl = document.getElementById("balanceAmount")
const incomeEl = document.getElementById("incomeAmount")
const expenseEl = document.getElementById("expenseAmount")
const savingsEl = document.getElementById("savingsRate")

const amountInput = document.getElementById("amountInput")
const descriptionInput = document.querySelector('input[placeholder="What was this for?"]')
const dateInput = document.querySelector("#transactionModal input[type='date']")

const saveBtn = document.getElementById("saveTransaction")

const table = document.getElementById("recentTransactions")
const transactionsList = document.getElementById("transactionsList")

/* FILTERS */

const filterAll = document.getElementById("filterAll")
const filterIncome = document.getElementById("filterIncome")
const filterExpense = document.getElementById("filterExpense")
const searchTransaction = document.getElementById("searchTransaction")

function setActiveFilter(button){

filterAll.classList.remove("active")
filterIncome.classList.remove("active")
filterExpense.classList.remove("active")

button.classList.add("active")

}

if(filterAll){

filterAll.onclick = ()=>{

setActiveFilter(filterAll)

renderTransactions(transactions)

}

}

if(filterIncome){

filterIncome.onclick = ()=>{

setActiveFilter(filterIncome)

const list = transactions.filter(t => t.type === "income")

renderTransactions(list)

}

}

if(filterExpense){

filterExpense.onclick = ()=>{

setActiveFilter(filterExpense)

const list = transactions.filter(t => t.type === "expense")

renderTransactions(list)

}

}

/* =========================
BUDGET ELEMENTS
========================= */

const budgetContainer = document.getElementById("budgetContainer")
const openBudgetBtn = document.getElementById("openBudgetModal")
const budgetModal = document.getElementById("budgetModal")
const cancelBudget = document.getElementById("cancelBudget")
const saveBudget = document.getElementById("saveBudget")

const budgetCategory = document.getElementById("budgetCategory")
const budgetAmount = document.getElementById("budgetAmount")

let editingBudgetIndex = null

/* =========================
GOALS ELEMENTS
========================= */

const goalsContainer = document.getElementById("goalsContainer")

const goalModal = document.getElementById("goalModal")
const openGoalBtn = document.getElementById("openGoalModal")
const cancelGoal = document.getElementById("cancelGoal")
const saveGoal = document.getElementById("saveGoal")

const goalName = document.getElementById("goalName")
const goalTarget = document.getElementById("goalTarget")
const goalSaved = document.getElementById("goalSaved")
const goalDate = document.getElementById("goalDate")

/* =========================
MODALS
========================= */

if(openBtn) openBtn.onclick = () => modal.classList.add("show")
if(fabBtn) fabBtn.onclick = () => modal.classList.add("show")
    
if(closeBtn) closeBtn.onclick = () => modal.classList.remove("show")
if(cancelBtn) cancelBtn.onclick = () => modal.classList.remove("show")

if(openBudgetBtn) openBudgetBtn.onclick = () => budgetModal.classList.add("show")
if(cancelBudget) cancelBudget.onclick = () => budgetModal.classList.remove("show")

if(openGoalBtn) openGoalBtn.onclick = () => goalModal.classList.add("show")
if(cancelGoal) cancelGoal.onclick = () => goalModal.classList.remove("show")

window.onclick = (e)=>{
if(e.target === modal) modal.classList.remove("show")
if(e.target === budgetModal) budgetModal.classList.remove("show")
if(e.target === goalModal) goalModal.classList.remove("show")
}

/* =========================
TRANSACTION TYPE
========================= */

const expenseBtn = document.getElementById("expenseBtn")
const incomeBtn = document.getElementById("incomeBtn")

const expenseCategories = document.getElementById("expenseCategories")
const incomeCategories = document.getElementById("incomeCategories")

let transactionType = "expense"

if(expenseBtn){
expenseBtn.onclick = () => {

transactionType="expense"

expenseBtn.classList.add("active")
incomeBtn.classList.remove("active")

expenseCategories.style.display="grid"
incomeCategories.style.display="none"

}
}

if(incomeBtn){
incomeBtn.onclick = () => {

transactionType="income"

incomeBtn.classList.add("active")
expenseBtn.classList.remove("active")

incomeCategories.style.display="grid"
expenseCategories.style.display="none"

}
}

/* =========================
CATEGORY SELECT
========================= */

let selectedCategory = ""

document.querySelectorAll(".category-grid button").forEach(btn=>{

btn.onclick = ()=>{

document.querySelectorAll(".category-grid button")
.forEach(b=>b.classList.remove("selected"))

btn.classList.add("selected")
selectedCategory = btn.innerText

}

})

/* =========================
ADD TRANSACTION
========================= */

if(saveBtn){
saveBtn.onclick = () => {

const amount = parseFloat(amountInput.value)

if(!amount || !selectedCategory){
alert("Enter amount and category")
return
}

const transaction={
type:transactionType,
amount:amount,
category:selectedCategory,
description:descriptionInput.value || "-",
date:dateInput.value || new Date().toISOString().split("T")[0],
recurring: document.getElementById("recurringToggle")?.checked || false,
lastProcessed: new Date().toISOString().split("T")[0]
}

transactions.push(transaction)

localStorage.setItem(
"transactions",
JSON.stringify(transactions)
)

modal.classList.remove("show")

amountInput.value=""
descriptionInput.value=""
const recurringToggle = document.getElementById("recurringToggle")
if(recurringToggle) recurringToggle.checked = false

updateDashboard()
renderTransactions()

}
}

/* =========================
DASHBOARD
========================= */

function renderGreeting(){

const greeting = document.getElementById("dashboardGreeting")
if(!greeting) return

const profile = JSON.parse(localStorage.getItem("userProfile")) || {}
const name = profile.name || "there"

const now = new Date()
const hour = now.getHours()

let message = ""

if(hour >= 5 && hour < 12){
message = "Good morning"
}
else if(hour >= 12 && hour < 17){
message = "Good afternoon"
}
else if(hour >= 17 && hour < 21){
message = "Good evening"
}
else{
message = "Working late"
}

greeting.innerText = message + ", " + name + " 👋"

}

function processRecurringTransactions(){

const today = new Date()
const todayStr = today.toISOString().split("T")[0]

transactions.forEach(t => {

if(!t.recurring) return

if(!t.lastProcessed){
t.lastProcessed = t.date
}

const last = new Date(t.lastProcessed)

if(
last.getFullYear() === today.getFullYear() &&
last.getMonth() === today.getMonth()
){
return
}

const newTransaction = {
...t,
date: todayStr,
lastProcessed: todayStr
}

transactions.push(newTransaction)

t.lastProcessed = todayStr

})

localStorage.setItem("transactions", JSON.stringify(transactions))

}

function updateDashboard(){

let income=0
let expense=0

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount
else expense+=t.amount
})

const balance=income-expense

if(balanceEl) balanceEl.innerText = currency + balance
if(incomeEl) incomeEl.innerText = currency + income
if(expenseEl) expenseEl.innerText = currency + expense

const rate = income===0?0:((income-expense)/income)*100
if(savingsEl) savingsEl.innerText=rate.toFixed(0)+"%"

updateTable()
renderBudgets()
renderMonthlySummary()
}

/* =========================
RECENT TABLE
========================= */

function updateTable(){

if(!table) return

table.innerHTML=""

transactions
.slice()
.reverse()
.slice(0,6)
.forEach(t=>{

const row=document.createElement("tr")

const sign = t.type==="income"?"+":"-"
const color = t.type==="income"?"success":"danger"

row.innerHTML=`
<td>${t.category}</td>
<td>${t.description}</td>
<td>${t.date}</td>
<td class="${color}">${sign}${currency}${t.amount}</td>
`

table.appendChild(row)

})

}

/* =========================
TRANSACTIONS PAGE
========================= */

function renderTransactions(list = transactions){

if(!transactionsList) return

/* EMPTY STATE */

if(list.length === 0){

transactionsList.innerHTML = `
<div class="empty-state">
<h3>No transactions yet</h3>
<p>Add your first expense to start tracking</p>
</div>
`

return
}

transactionsList.innerHTML=""

list.slice().reverse().forEach(t=>{

const realIndex = transactions.indexOf(t)

const card=document.createElement("div")
card.classList.add("transaction-card")

const sign = t.type==="income"?"+":"-"
const color = t.type==="income"?"success":"danger"

card.innerHTML=`

<div class="transaction-left">

<div class="transaction-icon">
${t.category.split(" ")[0]}
</div>

<div class="transaction-info">
<h4>${t.description} ${t.recurring ? "🔁" : ""}</h4>
<small>${t.category} • ${t.date}</small>
</div>

</div>

<div>

<span class="transaction-amount ${color}">
${sign}${currency}${t.amount}
</span>

<span class="delete-btn"
onclick="deleteTransaction(${realIndex})">
🗑
</span>

</div>
`

transactionsList.appendChild(card)

})

}

function deleteTransaction(index){

if(!confirm("Delete transaction?")) return

transactions.splice(index,1)

localStorage.setItem(
"transactions",
JSON.stringify(transactions)
)

updateDashboard()
renderTransactions()

}

/* =========================
BUDGETS
========================= */

if(saveBudget){

saveBudget.onclick = () => {

const category = budgetCategory.value
const amount = parseFloat(budgetAmount.value)

if(!amount){
alert("Enter budget amount")
return
}

if(editingBudgetIndex !== null){

budgets[editingBudgetIndex].category = category
budgets[editingBudgetIndex].amount = amount
editingBudgetIndex = null

}else{

budgets.push({
category: category,
amount: amount
})

}

localStorage.setItem("budgets", JSON.stringify(budgets))

budgetModal.classList.remove("show")

budgetCategory.value = ""
budgetAmount.value = ""

renderBudgets()

}

}

function calculateSpent(category){

let spent=0

transactions.forEach(t=>{
if(t.type==="expense" && t.category.includes(category)){
spent += t.amount
}
})

return spent

}

function renderBudgets(){

if(!budgetContainer) return

/* EMPTY STATE */

if(budgets.length === 0){

budgetContainer.innerHTML = `
<div class="empty-state">
<h3>No budgets yet</h3>
<p>Create your first budget</p>
</div>
`

return
}

budgetContainer.innerHTML=""

budgets.forEach((b,index)=>{

const spent = calculateSpent(b.category)
const percent = Math.min((spent/b.amount)*100,100)

const card=document.createElement("div")
card.classList.add("budget-card")

card.innerHTML=`

<div style="display:flex;justify-content:space-between;align-items:center;">

<h3>${b.category}</h3>

<div>

<span style="cursor:pointer;margin-right:10px"
onclick="editBudget(${index})">✏️</span>

<span style="cursor:pointer"
onclick="deleteBudget(${index})">🗑</span>

</div>

</div>

<div class="budget-bar">
<div class="budget-fill"
style="width:${percent}%"></div>
</div>

<p>${currency}${spent} of ${currency}${b.amount}</p>

`

budgetContainer.appendChild(card)

})

}

function editBudget(index){

const budget = budgets[index]

budgetCategory.value = budget.category
budgetAmount.value = budget.amount

editingBudgetIndex = index

budgetModal.classList.add("show")

}

function deleteBudget(index){

if(!confirm("Delete this budget?")) return

budgets.splice(index,1)

localStorage.setItem(
"budgets",
JSON.stringify(budgets)
)

renderBudgets()

}

/* =========================
GOALS
========================= */

if(saveGoal){
saveGoal.onclick = () => {

const name = goalName.value
const target = parseFloat(goalTarget.value)
const saved = parseFloat(goalSaved.value)

if(!name || !target){
alert("Enter goal name and target")
return
}

goals.push({
name:name,
target:target,
saved:saved || 0,
date:goalDate.value
})

localStorage.setItem(
"goals",
JSON.stringify(goals)
)

goalModal.classList.remove("show")

renderGoals()

}
}

function renderGoals(){

if(!goalsContainer) return

/* EMPTY STATE */

if(goals.length === 0){

goalsContainer.innerHTML = `
<div class="empty-state">
<h3>No goals yet</h3>
<p>Set a savings goal</p>
</div>
`

return
}

goalsContainer.innerHTML=""

goals.forEach((g,index)=>{

const percent = Math.min((g.saved/g.target)*100,100)
const remaining = g.target - g.saved

const card=document.createElement("div")
card.classList.add("goal-card")

card.innerHTML=`

<div class="goal-top">

<div class="goal-icon">🎯</div>

<div class="goal-info">
<h3>${g.name}</h3>
<small>${g.date ? g.date : ""}</small>
</div>

<span class="goal-delete"
onclick="deleteGoal(${index})">
🗑
</span>

</div>

<div class="goal-amounts">
<span>${currency}${g.saved}</span>
<span>${currency}${g.target}</span>
</div>

<div class="goal-progress">
<div class="goal-fill"
style="width:${percent}%"></div>
</div>

<div class="goal-stats">
<span>${percent.toFixed(0)}% complete</span>
<span>${currency}${remaining} to go</span>
</div>

<div style="display:flex;gap:10px;margin-top:10px;">

<input 
type="number"
placeholder="Add amount"
id="goalAdd${index}"
style="flex:1;padding:8px;border-radius:6px;border:none"
>

<button 
onclick="addToGoal(${index})"
style="padding:8px 14px;border:none;border-radius:6px;cursor:pointer"
>
➕
</button>

</div>

`

goalsContainer.appendChild(card)

})

}

function deleteGoal(index){

goals.splice(index,1)

localStorage.setItem(
"goals",
JSON.stringify(goals)
)

renderGoals()

}

function addToGoal(index){

const input = document.getElementById("goalAdd"+index)

const amount = parseFloat(input.value)

if(!amount || amount <= 0){
alert("Enter valid amount")
return
}

goals[index].saved += amount

localStorage.setItem(
"goals",
JSON.stringify(goals)
)

renderGoals()

}

/* =========================
SUBSCRIPTIONS
========================= */

function renderSubscriptions(){

const container = document.getElementById("subscriptionsList")
if(!container) return

container.innerHTML=""

let total = 0

transactions.forEach(t=>{

if(!t.recurring) return

total += t.amount

const card=document.createElement("div")
card.classList.add("transaction-card")

card.innerHTML=`

<div>
<h4>${t.description}</h4>
<small>${t.category}</small>
</div>

<div>
${currency}${t.amount} / month
</div>

`

container.appendChild(card)

})

const totalCard=document.createElement("div")

totalCard.style.marginTop="20px"
totalCard.style.fontWeight="600"
totalCard.style.fontSize="18px"

totalCard.innerText="Monthly total: "+currency+total

container.appendChild(totalCard)

}

/* =========================
ANALYTICS INSIGHTS
========================= */

function renderInsights(){

const topCategory = document.getElementById("topCategory")
const topCategoryAmount = document.getElementById("topCategoryAmount")

const biggestExpense = document.getElementById("biggestExpense")
const biggestExpenseAmount = document.getElementById("biggestExpenseAmount")

const monthlySavingsRate = document.getElementById("monthlySavingsRate")

const budgetAlert = document.getElementById("budgetAlert")
const budgetAlertText = document.getElementById("budgetAlertText")

let categoryTotals={}

transactions.forEach(t=>{
if(t.type==="expense"){
categoryTotals[t.category]=(categoryTotals[t.category]||0)+t.amount
}
})

let topCat="-"
let topAmount=0

Object.entries(categoryTotals).forEach(([cat,amount])=>{
if(amount>topAmount){
topCat=cat
topAmount=amount
}
})

if(topCategory) topCategory.innerText = topCat
if(topCategoryAmount) topCategoryAmount.innerText = currency +topAmount

let biggest = transactions
.filter(t=>t.type==="expense")
.sort((a,b)=>b.amount-a.amount)[0]

if(biggest){
if(biggestExpense) biggestExpense.innerText = biggest.category
if(biggestExpenseAmount) biggestExpenseAmount.innerText = currency +biggest.amount
}

let income=0
let expense=0

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount
else expense+=t.amount
})

let rate = income===0 ? 0 : ((income-expense)/income)*100

if(monthlySavingsRate) monthlySavingsRate.innerText = rate.toFixed(0)+"%"

let alert="All budgets safe"
let status="Good"

budgets.forEach(b=>{

let spent = calculateSpent(b.category)
let percent = (spent/b.amount)*100

if(percent>80){
status="Warning"
alert=b.category+" budget "+percent.toFixed(0)+"% used"
}

})

if(budgetAlert) budgetAlert.innerText=status
if(budgetAlertText) budgetAlertText.innerText=alert

}

/* =========================
SMART INSIGHTS
========================= */

const spendingInsight = document.getElementById("spendingInsight")
const spendingInsightText = document.getElementById("spendingInsightText")

const savingsInsight = document.getElementById("savingsInsight")
const savingsInsightText = document.getElementById("savingsInsightText")

const goalInsight = document.getElementById("goalInsight")
const goalInsightText = document.getElementById("goalInsightText")

/* income + expense */

let income = 0
let expense = 0

transactions.forEach(t=>{
if(t.type==="income") income += t.amount
else expense += t.amount
})

/* spending percentage */

if(income > 0){

let percent = ((expense/income)*100).toFixed(0)

if(spendingInsight)
spendingInsight.innerText = percent + "% of income"

if(spendingInsightText)
spendingInsightText.innerText = "Spent this month"

}

/* savings health */

let savingsRate = income===0 ? 0 : ((income-expense)/income)*100

let health = "Average"

if(savingsRate > 40) health = "Excellent"
else if(savingsRate > 20) health = "Good"
else if(savingsRate > 10) health = "Average"
else health = "Needs Improvement"

if(savingsInsight)
savingsInsight.innerText = health

if(savingsInsightText)
savingsInsightText.innerText = "Savings rate: " + savingsRate.toFixed(0) + "%"

/* goal prediction */

if(goals.length > 0){

let g = goals[0]

let monthlySavings = income - expense

if(monthlySavings > 0){

let remaining = g.target - g.saved
let months = Math.ceil(remaining / monthlySavings)

if(goalInsight)
goalInsight.innerText = months + " months"

if(goalInsightText)
goalInsightText.innerText = "Estimated time to reach goal"

}else{

if(goalInsight)
goalInsight.innerText = "No progress"

if(goalInsightText)
goalInsightText.innerText = "Increase savings to reach goal"

}

}

/* =========================
CHART THEME
========================= */

Chart.defaults.color = "#ffffff"

Chart.defaults.font.family = "Inter"

Chart.defaults.plugins.legend.labels.color = "#ffffff"

Chart.defaults.scale.grid.color = "rgba(255,255,255,0.08)"

Chart.defaults.scale.ticks.color = "rgba(255,255,255,0.8)"

Chart.defaults.plugins.tooltip.backgroundColor = "#111827"
Chart.defaults.plugins.tooltip.titleColor = "#ffffff"
Chart.defaults.plugins.tooltip.bodyColor = "#ffffff"

/* =========================
ANALYTICS CHARTS
========================= */

let categoryChart
let incomeExpenseChart
let savingsChart
let monthlySavingsChart

function renderAnalytics(){

renderInsights()

renderCategoryChart()
renderIncomeExpenseChart()
renderSavingsChart()
renderMonthlySavingsChart()

}

/* chart functions remain unchanged below */

function renderCategoryChart(){

const ctx = document.getElementById("categoryChart")
if(!ctx) return

if(categoryChart) categoryChart.destroy()

let data={}

transactions.forEach(t=>{
if(t.type==="expense"){
data[t.category]=(data[t.category]||0)+t.amount
}
})

categoryChart = new Chart(ctx,{
type:"doughnut",
data:{
labels:Object.keys(data),
datasets:[{
data:Object.values(data),
backgroundColor:[
"#10b981",
"#6366f1",
"#f59e0b",
"#ef4444",
"#06b6d4",
"#8b5cf6"
]
}]
}
})

}

function renderIncomeExpenseChart(){

const ctx = document.getElementById("incomeExpenseChart")
if(!ctx) return

if(incomeExpenseChart) incomeExpenseChart.destroy()

let income=0
let expense=0

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount
else expense+=t.amount
})

incomeExpenseChart = new Chart(ctx,{
type:"bar",
data:{
labels:["Income","Expense"],
datasets:[{
label:"Amount",
data:[income,expense],
backgroundColor:[
"#10b981",
"#ef4444"
],
borderRadius:8
}]
}
})

}

function renderSavingsChart(){

const ctx = document.getElementById("savingsChart")
if(!ctx) return

if(savingsChart) savingsChart.destroy()

let balance=0
let labels=[]
let values=[]

transactions
.slice()
.sort((a,b)=> new Date(a.date)-new Date(b.date))
.forEach(t=>{

if(t.type==="income") balance+=t.amount
else balance-=t.amount

labels.push(t.date)
values.push(balance)

})

savingsChart = new Chart(ctx,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Balance",
data:values,
borderColor:"#10b981",
backgroundColor:"rgba(16,185,129,0.15)",
fill:true,
tension:0.4,
pointRadius:4
}]
}
})

}

function renderMonthlySavingsChart(){

const ctx = document.getElementById("monthlySavingsChart")
if(!ctx) return

if(monthlySavingsChart) monthlySavingsChart.destroy()

let income={}
let expense={}

transactions.forEach(t=>{

let month = t.date.slice(0,7)

if(t.type==="income"){
income[month]=(income[month]||0)+t.amount
}

if(t.type==="expense"){
expense[month]=(expense[month]||0)+t.amount
}

})

let months=[...new Set([...Object.keys(income),...Object.keys(expense)])]

let savings=months.map(m => (income[m]||0)-(expense[m]||0))

monthlySavingsChart = new Chart(ctx,{
type:"bar",
data:{
labels:months,
datasets:[{
label:"Savings",
data:savings,
backgroundColor:"#10b981",
borderRadius:8
}]
}
})

}

/* =========================
MONTHLY SUMMARY
========================= */

function renderMonthlySummary(){

const summary = document.getElementById("summaryText")
if(!summary) return

let income = 0
let expense = 0
let categoryTotals = {}

transactions.forEach(t=>{

if(t.type==="income") income += t.amount
else{

expense += t.amount

categoryTotals[t.category] =
(categoryTotals[t.category] || 0) + t.amount

}

})

let savings = income - expense

let topCat = "-"
let topAmount = 0

Object.entries(categoryTotals).forEach(([cat,amt])=>{

if(amt > topAmount){
topCat = cat
topAmount = amt
}

})

let rate = income === 0 ? 0 : ((savings/income)*100).toFixed(0)

summary.innerText =
"You spent " + currency + expense +
" this month. Top category: " + topCat +
". You saved " + currency + savings +
". Savings rate: " + rate + "%."

}

/* =========================
NAVIGATION
========================= */


const pages = document.querySelectorAll(".page")
const navLinks = document.querySelectorAll(".sidebar a")

function showPage(pageId, link){

pages.forEach(p => p.classList.remove("active"))

const page = document.getElementById(pageId)
if(page) page.classList.add("active")

/* update sidebar highlight */

navLinks.forEach(l => l.classList.remove("active"))
if(link) link.classList.add("active")

}

document.getElementById("navDashboard").onclick = function(e){
e.preventDefault()
showPage("dashboardPage", this)
}

document.getElementById("navTransactions").onclick = function(e){
e.preventDefault()
showPage("transactionsPage", this)
renderTransactions()
}

document.getElementById("navBudgets").onclick = function(e){
e.preventDefault()
showPage("budgetsPage", this)
}

document.getElementById("navGoals").onclick = function(e){
e.preventDefault()
showPage("goalsPage", this)
renderGoals()
}

document.getElementById("navSubscriptions").onclick = function(e){
e.preventDefault()
showPage("subscriptionsPage", this)
renderSubscriptions()
}

document.getElementById("navAnalytics").onclick = function(e){
e.preventDefault()
showPage("analyticsPage", this)
renderAnalytics()
}

document.getElementById("navSettings").onclick = function(e){
e.preventDefault()
showPage("settingsPage", this)
}

/* SETTINGS */

const saveSettingsBtn = document.getElementById("saveSettings")
const currencySelect = document.getElementById("currencySelect")

/* EXPORT DATA */

const exportBtn = document.getElementById("exportData")

if(exportBtn){

exportBtn.onclick = () => {

const data = {
transactions,
budgets,
goals
}

const blob = new Blob(
[JSON.stringify(data,null,2)],
{ type:"application/json" }
)

const url = URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = "monetra-backup.json"

a.click()

URL.revokeObjectURL(url)

}

}

if(saveSettingsBtn){

saveSettingsBtn.onclick = () => {

localStorage.setItem("currency", currencySelect.value)

alert("Settings saved")

location.reload()

}

}

const clearDataBtn = document.getElementById("clearData")

if(clearDataBtn){

clearDataBtn.onclick = () => {

if(confirm("Delete all data?")){

localStorage.removeItem("transactions")
localStorage.removeItem("budgets")
localStorage.removeItem("goals")
location.reload()

}

}

}

/* =========================
TRANSACTION SEARCH
========================= */

if(searchTransaction){

searchTransaction.addEventListener("input", ()=>{

const term = searchTransaction.value.toLowerCase()

const filtered = transactions.filter(t =>

t.description.toLowerCase().includes(term) ||
t.category.toLowerCase().includes(term) ||
t.date.includes(term)

)

renderTransactions(filtered)

})

}

/* INITIAL LOAD */

processRecurringTransactions()

showPage("dashboardPage")
updateDashboard()
renderGreeting()
renderMonthlySummary()
renderBudgets()
renderGoals()

/* LOAD USER PROFILE */

const profile = JSON.parse(localStorage.getItem("userProfile"))

if(profile){

const nameInput = document.getElementById("userName")

if(nameInput) nameInput.value = profile.name || ""

}


function initOnboarding(){

let currentStep = 1

const fab = document.getElementById("fabAddTransaction")
if(fab) fab.style.display = "none"

const steps = document.querySelectorAll(".onboarding-step")
const nextButtons = document.querySelectorAll(".onboard-next")
const finishButton = document.getElementById("onboardFinish")

function showStep(step){

steps.forEach(s => s.classList.remove("active"))

const target = document.querySelector('[data-step="'+step+'"]')
if(target) target.classList.add("active")

/* progress bar */

if(steps.length > 1){

const progress = ((step - 1) / (steps.length - 1)) * 100

const bar = document.getElementById("progressBar")
const text = document.getElementById("progressText")

if(bar) bar.style.width = progress + "%"

if(text) text.innerText = "Step " + step + " of " + steps.length

}

}

/* show first step */

showStep(currentStep)

/* NEXT BUTTONS */

nextButtons.forEach(btn => {

btn.addEventListener("click", () => {

if(currentStep < steps.length){
currentStep++
showStep(currentStep)
}

})

})

/* FINISH BUTTON */

if(finishButton){

finishButton.addEventListener("click", async () => {

const data = {
name: document.getElementById("onboardName")?.value || "",
income: document.getElementById("onboardIncome")?.value || "",
source: document.getElementById("onboardSource")?.value || "",
expenses: document.getElementById("onboardExpenses")?.value || "",
savings: document.getElementById("onboardSavings")?.value || "",
goal: document.getElementById("onboardGoal")?.value || ""
}

/* SAVE TO SUPABASE */

try {

const { data: result, error } = await supabaseClient
.from("profiles")
.insert([
{
name: data.name,
income: data.income,
income_source: data.source,
expenses: data.expenses,
savings: data.savings,
goal: data.goal
}
])

if(error){
console.error("Supabase insert error:", error)
}else{
console.log("Saved to Supabase:", result)
}

} catch(err){
console.error("Supabase connection failed:", err)
}

/* save locally */

localStorage.setItem("userProfile", JSON.stringify(data))
localStorage.setItem("onboardingComplete","true")

/* hide onboarding */

const onboarding = document.getElementById("onboarding")
if(onboarding) onboarding.style.display="none"

if(fab) fab.style.display = "flex"

/* celebration */

confetti({
particleCount:200,
spread:110,
origin:{ y:0.6 }
})

})

}

}

/* RUN ONBOARDING ONLY IF NEEDED */

document.addEventListener("DOMContentLoaded", () => {

const onboardingComplete = localStorage.getItem("onboardingComplete")

if(onboardingComplete === "true"){

const onboarding = document.getElementById("onboarding")
if(onboarding) onboarding.style.display = "none"

}else{

initOnboarding()

}
})