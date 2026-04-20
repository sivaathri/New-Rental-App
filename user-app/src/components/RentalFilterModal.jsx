import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from './DateTimePicker';

const { width, height } = Dimensions.get('window');

const RentalFilterModal = ({ visible, onClose, onApply, onClear }) => {
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('5000');
  const [rentalTime, setRentalTime] = useState('Day');
  const [sittingCapacity, setSittingCapacity] = useState('Any');
  const [sortBy, setSortBy] = useState('Popularity');

  const [fuelType, setFuelType] = useState('Petrol');
  const [fromDate, setFromDate] = useState('21 Apr, 2026');
  const [toDate, setToDate] = useState('22 Apr, 2026');
  const [driverOption, setDriverOption] = useState('Any');
  const [datePickerType, setDatePickerType] = useState('from'); // 'from' or 'to'
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const rentalTimes = ['Hour', 'Day'];
  const sittingCapacities = ['Any', '2+', '4+', '5+', '7+'];
  const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];
  const fuelTypes = ['Electric', 'Petrol', 'Diesel', 'Hybrid'];
  const driverOptions = ['Any', 'Self Drive', 'With Driver'];

  const handleClearAll = () => {
    setMinPrice('0');
    setMaxPrice('5000');
    setRentalTime('Day');
    setSittingCapacity('Any');
    setSortBy('Popularity');
    setFuelType('Petrol');
    setDriverOption('Any');
    setFromDate('21 Apr, 2026');
    setToDate('22 Apr, 2026');
    if (onClear) {
      onClear();
    }
  };

  const handleApply = () => {
    const filters = {
      minPrice,
      maxPrice,
      rentalTime,
      sittingCapacity,
      sortBy,
      fuelType,
      driverOption,
      fromDate,
      toDate
    };
    onApply(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filters</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price range</Text>
              
              {/* Price Chart Visualization */}
              <View style={styles.chartContainer}>
                {[10, 15, 25, 35, 50, 60, 55, 70, 80, 65, 75, 85, 70, 60, 50, 40, 30, 20].map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chartBar,
                      { height: height }
                    ]}
                  />
                ))}
              </View>

              <View style={styles.priceInputRow}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Minimum</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={`₹${minPrice}`}
                    onChangeText={(val) => setMinPrice(val.replace('₹', ''))}
                  />
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Maximum</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={`₹${maxPrice}`}
                    onChangeText={(val) => setMaxPrice(val.replace('₹', ''))}
                  />
                </View>
              </View>
            </View>

            {/* Rental Time */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental Time</Text>
              <View style={styles.buttonRow}>
                {rentalTimes.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.optionBtn, rentalTime === time && styles.optionBtnActive]}
                    onPress={() => setRentalTime(time)}
                  >
                    <Text style={[styles.optionBtnText, rentalTime === time && styles.optionBtnTextActive]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.buttonRow}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionBtn, sortBy === option && styles.optionBtnActive]}
                    onPress={() => setSortBy(option)}
                  >
                    <Text style={[styles.optionBtnText, sortBy === option && styles.optionBtnTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sitting Capacity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sitting Capacity</Text>
              <View style={styles.buttonRow}>
                {sittingCapacities.map((capacity) => (
                  <TouchableOpacity
                    key={capacity}
                    style={[styles.optionBtn, sittingCapacity === capacity && styles.optionBtnActive]}
                    onPress={() => setSittingCapacity(capacity)}
                  >
                    <Text style={[styles.optionBtnText, sittingCapacity === capacity && styles.optionBtnTextActive]}>
                      {capacity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Pick up and Drop Date */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental Period</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity 
                    style={styles.dateInputHalf} 
                    onPress={() => { setDatePickerType('from'); setDatePickerVisible(true); }}
                >
                  <Text style={styles.dateLabelSmall}>From</Text>
                  <View style={styles.dateValueRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.dateTextSmall}>{fromDate}</Text>
                  </View>
                </TouchableOpacity>
                
                <View style={styles.dateSeparator}>
                    <Ionicons name="arrow-forward" size={16} color="#DDD" />
                </View>

                <TouchableOpacity 
                    style={styles.dateInputHalf} 
                    onPress={() => { setDatePickerType('to'); setDatePickerVisible(true); }}
                >
                  <Text style={styles.dateLabelSmall}>To</Text>
                  <View style={styles.dateValueRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.dateTextSmall}>{toDate}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Driver Preference */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Driver</Text>
              <View style={styles.buttonRow}>
                {driverOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionBtn, driverOption === option && styles.optionBtnActive]}
                    onPress={() => setDriverOption(option)}
                  >
                    <Text style={[styles.optionBtnText, driverOption === option && styles.optionBtnTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fuel Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fuel Type</Text>
              <View style={styles.buttonRow}>
                {fuelTypes.map((fuel) => (
                  <TouchableOpacity
                    key={fuel}
                    style={[styles.optionBtn, fuelType === fuel && styles.optionBtnActive]}
                    onPress={() => setFuelType(fuel)}
                  >
                    <Text style={[styles.optionBtnText, fuelType === fuel && styles.optionBtnTextActive]}>
                      {fuel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Show</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Time Picker */}
      <DateTimePicker
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onSelect={(dateTime) => {
          if (datePickerType === 'from') {
            setFromDate(dateTime.date);
          } else {
            setToDate(dateTime.date);
          }
        }}
        initialDate={datePickerType === 'from' ? fromDate : toDate}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.9,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  optionBtnActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  optionBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionBtnTextActive: {
    color: '#FFF',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    marginBottom: 16,
  },
  chartBar: {
    width: (width - 80) / 18,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  priceInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#FFF',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#FFF',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateInputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  dateLabelSmall: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateTextSmall: {
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
  },
  dateSeparator: {
    width: 24,
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  clearBtnText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default RentalFilterModal;
