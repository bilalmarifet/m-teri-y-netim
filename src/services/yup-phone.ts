import yup from 'yup'

const rePhoneNumber = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

module.exports.rePhoneNumber = rePhoneNumber

yup.addMethod(yup.string, "phone", function() {
  return this.test("phone", "Phone number is not valid", value =>
    rePhoneNumber.test(value)
  );
});