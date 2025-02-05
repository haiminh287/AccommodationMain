import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center"
    }, row: {
        flexDirection: "row"
    }, wrap: {
        flexWrap: "wrap"
    }, subject: {
        fontSize: 20,
        fontWeight: "bold",
        color: "blue"
    }, margin: {
        margin: 5
    }, box: {
        width: 80,
        height: 80,
        borderRadius: 10
    },
    radioContainer: {
        flexDirection: 'column',
        marginVertical: 10,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    }
});

export const baseStyle = {
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Nền mờ
        borderRadius: 20, // Bo góc mềm mại
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerApp: {
        flex:1,
        backgroundColor: 'rgba(191, 232, 244, 0.9)', // Trong suốt
        borderRadius: 20,
        margin: 10,
        height: 30,
        // width:80,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        alignContent: 'center',
        justifyContent: 'center',
    },
    marginSpace: {
        marginBottom: 0,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject, // Giúp gradient phủ toàn bộ View cha
        borderRadius: 10, // Tuỳ chỉnh bo góc nếu cần
    },
}