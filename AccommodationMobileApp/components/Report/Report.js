import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import APIs, { endpoints } from "../../configs/APIs";

const Report = () => {
  const [userStatistics, setUserStatistics] = useState([]);
  const [inkeeperStatistics, setInkeeperStatistics] = useState([]);

  const loadData = async (period) => {
    const res = await APIs.get(endpoints['user-statistics'], { params: { period: period } });
    console.log(res.data);
    setUserStatistics(res.data.user_statistics);
    setInkeeperStatistics(res.data.inkeeper_statistics);
  }

  useEffect(() => {
    loadData('month');
  }, []);

  const renderChart = (data, label) => {
    return (
      <BarChart
        data={{
          labels: data.map(item => item.period),
          datasets: [
            {
              data: data.map(item => item.count)
            }
          ]
        }}
        width={Dimensions.get("window").width - 32} 
        height={200} 
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          yAxisInterval: 1,
          fromZero: true,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          barPercentage: 0.5, 
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
      <Text style={styles.title}>Report</Text>
      <View style={styles.buttonContainer}>
        <Button title="Tháng" onPress={() => loadData('month')} />
        <Button title="Quý" onPress={() => loadData('quarter')} />
        <Button title="Năm" onPress={() => loadData('year')} />
      </View>
      <Text style={styles.subtitle}>User Statistics</Text>
      {renderChart(userStatistics, "User Statistics")}
      <Text style={styles.subtitle}>Inkeeper Statistics</Text>
      {renderChart(inkeeperStatistics, "Inkeeper Statistics")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default Report;