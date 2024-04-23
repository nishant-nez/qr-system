"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
// import QrReader from 'react-qr-scanner'
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { Helmet } from "react-helmet";
// import QrScanner from ""

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 350,
        height: 350,
      },
      fps: 5,
    });
    scanner.render(success, error);

    async function success(result) {
      setOpen(true);

      setScanResult(result);
      scanner.clear();

    }

    function error() {
      console.warn(err)
    }
  }, []);

  useEffect(() => {
    if (scanResult) {
      const fetchData = async () => {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_URL + '/api/sheet/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: scanResult.split('split')[0],
              sheet: scanResult.split('split')[1],
            })
          });

          setData(await res.json());
        } catch (e) {
          console.log("error: ", e);
        }
      }
      fetchData();
    }

  }, [scanResult])

  const handleModalClose = () => {
    setData('');
    setOpen(false);
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 350,
        height: 350,
      },
      fps: 5,
    });

    const success = (result) => {
      setOpen(true);
      setScanResult(result);
      scanner.clear();
    }
    scanner.render(success);
  }

  return (
    <main
      className={ `flex min-h-screen flex-col items-center p-24` }
    >
      qr scanner

      {/* {
        scanResult ?
          <>
            <div>Success: </div>
            <div>{ scanResult }</div>
          </>
          :
          <div id="reader"></div>
      } */}

      {/* <button className="btn btn-danger" onClick={ () => setOpen(true) }>
        Delete
      </button> */}
      <div className="z-50">
        <Modal open={ open } onClose={ handleModalClose }>
          <div className="text-center w-96">
            { data && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">{ scanResult.split('split')[1] }</h2>
                <table className="w-full">
                  <tbody>
                    { Object.entries(data.data).map(([key, value]) => (
                      <tr key={ key }>
                        <td className="py-2 px-4 text-gray-600 font-semibold">{ key }</td>
                        <td className="py-2 px-4 bg-gray-100">
                          { JSON.stringify(value).replace(/"/g, '') }
                        </td>
                      </tr>
                    )) }
                  </tbody>
                </table>
              </div>
            ) }
          </div>
        </Modal>
      </div>


      {/* <Modal /> */ }
      <div id="reader" className="w-[800px]"></div>

    </main >
  );
}


// export async function getServerSideProps() {
//   const req = await fetch('localhost:3000/api/sheet');
//   const res = await req.json();

//   return {
//     props: {
//       sheetdata: res.data,
//     }
//   }
// }