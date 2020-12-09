import React, { useState, useEffect } from "react";
import DataTable from "../DataTable";
import Nav from "../Nav";
import API from "../../utils/API";
import "./DataArea.css";
import DataAreaContext from "../../utils/DataAreaContext"

const DataArea = () => {
    const [developerState, setDeveloperState] = useState({
        users: [],
        order: "ascend",
        filtered: [],
        headers: [
            { name: "Image", width: "10%", },
            { name: "Name", width: "10%", },
            { name: "Phone", width: "20%", },
            { name: "Email", width: "20%", },
            { name: "DOB", width: "10%", }
        ]
    });

    const handleSort = header => {
        if (developerState.order === "descend") {
            setDeveloperState({
                order: "ascend"
            })
        } else {
            setDeveloperState({
                order: "descend"
            })
        }

        const compareFnc = (a, b) => {
            if (developerState.order === "ascend") {
                if (a[header] === undefined) {
                    return 1;
                } else if (b[header] === undefined) {
                    return -1;
                } else if (header === "name") {
                    return a[header].first.localeCompare(b[header].first);
                } else {
                    return b[header] - a[header];
                }
            } else {
                if (a[header] === undefined) {
                    return 1;
                } else if (b[header] === undefined) {
                    return -1;
                } else if (header === "name") {
                    return b[header].first.localeCompare(a[header].first);
                } else {
                    return b[header] - a[header];
                }
            }
        }
        const sortedUsers = developerState.filtered.sort(compareFnc);

        setDeveloperState({
            ...developerState,
            filtered: sortedUsers
        });

    };

    const handleSearchChange = event => {
        const filter = event.target.value;
        const filteredList = developerState.users.filter(item => {
            let values = item.name.first.toLowerCase();
            return values.indexOf(filter.toLowerCase()) !== -1;
        });

        setDeveloperState({
            ...developerState,
            filtered: filteredList
        });
    };

    useEffect(() => {
        API.getUsers().then(results => {
            setDeveloperState({
                ...developerState,
                users: results.data.results,
                filtered: results.data.results
            });
        });
    }, []);

    return (
        <DataAreaContext.Provider
            value={{ developerState, handleSearchChange, handleSort }}
        >
            <Nav />
            <div className="data-area">
                {developerState.filtered.length > 0
                    ? <DataTable />
                    : <div></div>
                }
            </div>
        </DataAreaContext.Provider>
    );
}

export default DataArea;