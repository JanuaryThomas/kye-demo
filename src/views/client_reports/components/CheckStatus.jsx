import React from "react";
import {
    Page,
    Text,
    View,
    Image,
    Document,
    StyleSheet,
    Font
} from "@react-pdf/renderer";

import styles from "../styles";

const CheckStatus = ({ statuses }) => (
    <View style={styles.section}>
        <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 3 }}>
                <Text style={styles.subtitle}>
                    Background Check Included in this Report
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.subtitle}>Status :</Text>
            </View>
        </View>

        {statuses.map((status,index) => (
            <View
                style={[
                    {
                        flexDirection: "row",
                        marginVertical: 8,
                        paddingVertical: 8,
                        paddingLeft: 8
                    },
                    styles.bodyPrimaryBackground
                ]}
                key={index}
            >
                <View style={{ flex: 3 }}>
                    <Text style={styles.text}>{status&&status}</Text>
                </View>
                <View style={{ flex: 1, marginVertical: -8, marginLeft: 2 }}>
                    <View
                        style={{ flex: 1, backgroundColor: "#00ff00" }}
                    ></View>
                </View>
            </View>
        ))}
    </View>
);

export default CheckStatus;