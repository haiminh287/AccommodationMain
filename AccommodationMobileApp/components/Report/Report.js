import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import APIs, { endpoints } from "../../configs/APIs";

const Report = () => {
  const [userStatistics, setUserStatistics] = useState([]);
  const [inkeeperStatistics, setInkeeperStatistics] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const loadData = async (period) => {
    const res = await APIs.get(endpoints['user-statistics'], { params: { period: period } });
    console.log(res.data);
    setUserStatistics(res.data.user_statistics);
    setInkeeperStatistics(res.data.inkeeper_statistics);
    setSelectedPeriod(period);
  }

  useEffect(() => {
    loadData('month');
  }, []);

  const renderChart = (data, label) => {
    const modifiedData = [{ period: '', count: 0 }, ...data];
    return (
      <BarChart
        data={{
          labels: modifiedData.map(item => item.period),
          datasets: [
            {
              data: modifiedData.map(item => item.count)
            }
          ]
        }}
        width={Dimensions.get("window").width - 32} 
        height={220} 
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#e0f7fa",
          backgroundGradientTo: "#80deea",
          decimalPlaces: 0,
          color: (opacity = 0.5) => `rgba(0, 0, 139, ${opacity})`,
          labelColor: (opacity = 0.5) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          barPercentage: 0.7, 
          propsForBackgroundLines: {
            strokeDasharray: "" 
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
        />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        {['month', 'quarter', 'year'].map(period => (
          <TouchableOpacity key={period} onPress={() => loadData(period)} style={[styles.touchable, selectedPeriod === period && styles.selectedButton]}>
            <Text style={[styles.buttonText, selectedPeriod === period && styles.selectedButtonText]}>
              {period === 'month' ? 'Tháng' : period === 'quarter' ? 'Quý' : 'Năm'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitle}>Thống Kê Số Lượng Người Dùng</Text>
      {renderChart(userStatistics, "User Statistics")}
      <Text style={styles.subtitle}>Thống Kê Số Lượng Người Cho Thuê Trọ</Text>
      {renderChart(inkeeperStatistics, "Inkeeper Statistics")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#00796b',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    backgroundColor: '#b2ebf2',
    borderRadius: 8,
    padding: 8,
  },
  touchable: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#00796b',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
  },
  selectedButtonText: {
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#00796b',
  },
});

export default Report;