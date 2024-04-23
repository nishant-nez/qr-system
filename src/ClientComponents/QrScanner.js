import React from "react";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner), {
    loading: () => <>Loading&nbsp;&hellip;</>,
    ssr: false,
});

export default QrScanner;