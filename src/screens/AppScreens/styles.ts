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
    marginHorizontal: 10,
    borderWidth: 0,
    paddingLeft: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    borderColor: colors.borderColor,
    backgroundColor: colors.containerBgInner,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
});

export default styles;
