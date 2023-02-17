import React, { useState } from 'react';
import * as XLSX from 'xlsx';
export default function ExcelReader({ setState }) {
    function handleChange(e) {
        const reader = new FileReader();
        reader.onload = evt => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            /* Update state */
            // console.log('Data>>>' + data, typeof data);
            const parseData = data.trim().split('\n');
            const array = parseData
                .filter((path, index) => index !== 0)
                .map((path, index) => path.split(','));
            console.log({ parseData, array });

            setState(array);
        };

        reader.readAsBinaryString(e.target.files[0]);
        console.log(e.target.files[0]);
    }
    return (
        <>
            <input type="file" name="" id="" onChange={handleChange} />
        </>
    );
}
