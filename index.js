const { argv } = process
const [loan, mrr, startPayment] = argv.slice(2)

const MRR = Number(mrr) / 100
const NUMBER_OF_MONTHS_IN_YEAR = 12
const NUMBER_OF_INSTALLMENTS = 30 * NUMBER_OF_MONTHS_IN_YEAR
const MARGIN_END_BALANCE = 0
const PAYMENT_STEP = 10

let payment = Number(startPayment) || 30000
let accumulatedBalance = Number(loan)
let totalInterest = 0
// 1st round
calculate()

// consecutive rounds
while (accumulatedBalance > MARGIN_END_BALANCE) {
  payment += PAYMENT_STEP
  accumulatedBalance = Number(loan)
  totalInterest = 0

  calculate()
}

function calculate() {
  for (let i = 0; i < NUMBER_OF_INSTALLMENTS; i++) {
    const interest = (MRR * accumulatedBalance) / NUMBER_OF_MONTHS_IN_YEAR
    totalInterest += interest
    accumulatedBalance = accumulatedBalance - (payment - interest)
  }
}

console.log("No. of installments:", NUMBER_OF_INSTALLMENTS)
console.log("Payment per installment:", payment)
console.log("Total interest", formatCurrency(totalInterest))
console.log(
  "Total interest (% of loan)",
  formatNumber((totalInterest / Number(loan)) * 100) + "%"
)
console.log("Total payment", formatCurrency(payment * NUMBER_OF_INSTALLMENTS))

function formatNumber(number) {
  return new Intl.NumberFormat("th-TH").format(number)
}

function formatCurrency(number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(number)
}
