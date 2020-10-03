function info(msg) {
  console.log(new Date(), msg)
}

function error(err) {
  console.error(new Date(), err.message)
}

module.exports = { error, info }
