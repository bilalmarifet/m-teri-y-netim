import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../../constants";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBg,
    paddingTop:'30%'
  },
  headStyle: {
    marginTop:'5%',
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor
  },
  headText: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom:20,
    color:colors.IconColor
  },
  inputContainer: {
    justifyContent: "center",
    padding: 20,
 
  },
  signupLink: {
    flexDirection: "row",
    justifyContent: "center"
  },

});

export default styles;
