import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { useSelector } from "react-redux";

import styles from "./styles";

import ReportIntro from "./components/ReportIntro";
import CheckStatus from "./components/CheckStatus";
import Observations from "./components/Observations";
import Note from "./components/Note";

const SocialMediaAnalysis = ({ media }) => (
    <View style={styles.section} break>
        <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.subtitle}>Media Verification Written</Text>
            </View>
        </View>
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>
                        Details of Media
                    </Text>
                </View>

                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>
                        Observation
                    </Text>
                </View>

                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>Results</Text>
                </View>
            </View>

            <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>Source</Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>
            </View>

            <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>Matching Account</Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>
            </View>


            <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>
                        Comments
                    </Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>
                

            </View>


            <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.bold]}>
                        Year/Month of Search
                    </Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>

                <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>{}</Text>
                </View>
                

            </View>

        </View>
    </View>
);

const SocialMediaReport = () => {
    const media = useSelector(
        state => state.orders.currentOrder["social-media"]
    );

    if (media=== null || media === undefined) {
        return null;
    }

    return (
        // <Document style={{ height: "400px" }}>
        <Page style={styles.body}>
            <ReportIntro />
            <CheckStatus statuses={[]} />
            <Observations />
            <SocialMediaAnalysis media={media} />
            {/* <Note /> */}
            <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) =>
                    `${pageNumber} / ${totalPages}`
                }
                fixed
            />
        </Page>
    );
};

export default SocialMediaReport;
