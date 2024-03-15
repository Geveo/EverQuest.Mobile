import React, { useState } from 'react';
  import { StyleSheet, View, Text } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from '@expo/vector-icons/AntDesign';
import AppTheme from '../../helpers/theme';

  const data = [
    { label: 'Round 1', value: '1' },
    { label: 'Round 2', value: '2' },
    { label: 'Round 3', value: '3' },
    { label: 'Round 4', value: '4' },
    { label: 'Round 5', value: '5' },
    { label: 'Round 6', value: '6' },
    { label: 'Round 7', value: '7' },
    { label: 'Round 8', value: '8' },
    { label: 'Round 9', value: '9' },
    { label: 'Round 10', value: '10' },
    { label: 'Round 11', value: '11' },
    { label: 'Round 12', value: '12' },
  ];

  const DropdownComponent = ({ maxRounds, selectedRound, onRoundChange }) => {
    const [value, setValue] = useState(selectedRound);

    const filteredData = data.filter(item => parseInt(item.value) <= maxRounds);
    

    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value === value && (
            <AntDesign
              style={styles.icon}
              color={AppTheme.colors.textGrey}
              name="Safety"
              size={20}
            />
          )}
        </View>
      );
    };

    return (
      <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={filteredData} // Use filteredData instead of the original data array
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Round..."
      searchPlaceholder="Search..."
      value={value}
      onChange={item => {
        setValue(item.value);
        onRoundChange(item.value);
      }}
      renderItem={renderItem}
    />
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    dropdown: {
      margin: 16,
      height: 50,
      backgroundColor: AppTheme.colors.tabGrey,
      borderRadius: 12,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    icon: {
      marginRight: 5,
      color: AppTheme.colors.textGrey,
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 18,
      color: AppTheme.colors.textGrey,
      fontWeight: '600',
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 18,
        color: AppTheme.colors.black,
        fontWeight: '600',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      color: AppTheme.colors.textGrey,
    },
  });