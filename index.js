;(function (window) {
  window.calculateMortgage = calculateMortgage
  window.formatNumber = function formatNumber(input) {
    const parsedNumber = parseNumber(input.value)
    const formattedNumber = format(parsedNumber)
    if (formattedNumber === "0") {
      input.value = ""
      return
    }

    if (formattedNumber === "NaN") {
      input.value = input.value.slice(0, -1)
      return
    }
    input.value = formattedNumber
  }

  function parseNumber(numberString) {
    return Number(numberString.replace(/[,.]/g, ""))
  }

  function format(number) {
    return new Intl.NumberFormat("en-US").format(number)
  }
  function calculateMortgage(loan, mrr, years = 30, startPayment) {
    loan = parseNumber(loan)
    startPayment = parseNumber(startPayment)

    const MRR = Number(mrr) / 100
    const NUMBER_OF_MONTHS_IN_YEAR = 12
    const NUMBER_OF_INSTALLMENTS = years * NUMBER_OF_MONTHS_IN_YEAR
    const TARGET_BALANCE = 0
    const PAYMENT_STEP = 10

    let numberOfInstallments = 0
    let payment = Number(startPayment) || 30000
    let accumulatedBalance = Number(loan)
    let totalInterest = 0
    // 1st round
    loop()

    // consecutive rounds
    while (accumulatedBalance > TARGET_BALANCE) {
      payment += PAYMENT_STEP
      accumulatedBalance = Number(loan)
      totalInterest = 0
      numberOfInstallments = 0

      loop()
    }

    function loop() {
      for (let i = 0; i < NUMBER_OF_INSTALLMENTS; i++) {
        numberOfInstallments += 1
        const interest = (MRR * accumulatedBalance) / NUMBER_OF_MONTHS_IN_YEAR
        totalInterest += interest
        accumulatedBalance = accumulatedBalance - (payment - interest)
        if (accumulatedBalance < 0) {
          break
        }
      }
    }

    const data = {
      numberOfInstallments,
      payment: formatCurrency(payment),
      totalInterests: formatCurrency(totalInterest),
      interestByLoan: formatNumber((totalInterest / Number(loan)) * 100) + "%",
      totalPayment: formatCurrency(
        payment * numberOfInstallments + accumulatedBalance
      ),
    }

    console.log("No. of installments:", data.numberOfInstallments)
    console.log("Payment per installment:", data.payment)
    console.log("Total interest", data.totalInterests)
    console.log("Total interest (% of loan)", data.interestByLoan)
    console.log("Total payment", data.totalPayment)

    return data
  }

  function formatNumber(number) {
    return new Intl.NumberFormat("th-TH").format(number)
  }

  function formatCurrency(number) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(number)
  }
})(window)
