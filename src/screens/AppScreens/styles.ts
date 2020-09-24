import {StyleSheet} from 'react-native';
import {colors} from '../../constants';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBg,
  },
  loadingFooter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    height:230,
    marginHorizontal: 10,
    borderWidth: 0,
    paddingLeft: 10,
    borderRadius: 10,
   paddingBottom:30,
    flexDirection: 'column',
    marginBottom: 10,
    borderColor: colors.borderColor,
    backgroundColor: colors.containerBgInner,
    shadowColor: '#000',
    position:'relative',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
  },
  itemCart: {

    borderWidth: 0,
paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:'#cccc',
    borderStyle:'solid',
    flexDirection: 'column',

    borderColor: colors.borderColor,
    backgroundColor: colors.containerBgInner,
    shadowColor: '#000',
    position:'relative',

  },
  itemOrder:{
    marginHorizontal:10,
    borderWidth: 0,
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:'#cccc',
    borderStyle:'solid',
    flexDirection: 'column',
    borderRadius:10,
    borderColor: colors.borderColor,
    backgroundColor: colors.containerBgInner,
    shadowColor: '#000',
    position:'relative',
    marginBottom:10
  }
});

export default styles;
