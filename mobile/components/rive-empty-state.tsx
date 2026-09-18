import React, { useEffect } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import {
  Alignment,
  Fit,
  RiveView,
  useRive,
  useRiveFile,
} from "@rive-app/react-native";

import { Colors, Space, Type } from "@/constants/theme";

interface RiveEmptyStateProps {
  type?: "search" | "watchlist" | "check";
  title: string;
  message: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RiveEmptyState({
  type = "search",
  title,
  message,
  action,
  style,
}: RiveEmptyStateProps) {
  const { riveFile: iconsFile } = useRiveFile(
    require("@/assets/rive/icons.riv")
  );
  const { riveFile: checkFile } = useRiveFile(
    require("@/assets/rive/check.riv")
  );
  const { riveViewRef, setHybridRef } = useRive();

  const isCheck = type === "check";
  const artboardName =
    type === "search" ? "SEARCH" : type === "watchlist" ? "LIKE/STAR" : "check_artboard";
  const stateMachineName =
    type === "search"
      ? "SEARCH_Interactivity"
      : type === "watchlist"
      ? "STAR_Interactivity"
      : "State Machine 1";

  const targetFile = isCheck ? checkFile : iconsFile;

  useEffect(() => {
    if (riveViewRef && isCheck) {
      try {
        riveViewRef.triggerInput("Check");
      } catch (e) {}
    }
  }, [riveViewRef, isCheck]);

  return (
    <View style={[styles.container, style]}>
      {targetFile ? (
        <View style={styles.riveWrapper}>
          <RiveView
            hybridRef={setHybridRef}
            file={targetFile}
            artboardName={artboardName}
            stateMachineName={stateMachineName}
            fit={Fit.Contain}
            alignment={Alignment.Center}
            autoPlay={true}
            style={styles.rive}
          />
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Space.xl,
    paddingVertical: Space.xxl,
    gap: Space.xs,
  },
  riveWrapper: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Space.xs,
  },
  rive: {
    width: 88,
    height: 88,
  },
  placeholder: {
    width: 88,
    height: 88,
    marginBottom: Space.xs,
  },
  title: {
    ...Type.headline,
    color: Colors.label,
    textAlign: "center",
  },
  message: {
    ...Type.subhead,
    color: Colors.secondaryLabel,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 20,
  },
  action: {
    marginTop: Space.md,
  },
});
