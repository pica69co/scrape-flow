"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

export const ReactCountupWrapper = ({ value }: { value: number }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [mounted]);
  if (!mounted) {
    return "-";
  }
  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
};
