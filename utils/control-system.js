const fs = require('fs');
const chalk = require('chalk');
const path = require('path');


// membuat folder jika tidak ada
const folderPath = __dirname;
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// membuat file jika tidak ada
const filePath = 'data-siswa.json';
if(!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
}

const loadData = () => {
    const buffer = fs.readFileSync(filePath, 'utf-8');
    const datas = JSON.parse(buffer);
    // sorting data di database
    datas.sort((a, b) => {
        if (a.nama.toLowerCase() < b.nama.toLowerCase()) return -1;
        if (a.nama.toLowerCase() > b.nama.toLowerCase()) return 1;
        return 0;
    })
    return datas;
}

const cekDuplikat = (nama) => {
    datas = loadData();
    return datas.find((elm) => elm.nama === nama);
}

const findData = (nama) => {
    const datas = loadData();
    const dataObj = datas.find((elm) => elm.nama.toLowerCase() === nama.toLowerCase());

    if (!dataObj) {
        console.log('no data available')
        return
    }
    return dataObj
}

const saveDatas = (datas) => {
    fs.writeFileSync('data-siswa.json', JSON.stringify(datas, null, 4))
}

const addData = (data) => {
    const datas = loadData();
    datas.push(data)
    saveDatas(datas)
}

const deleteData = (nama) => {
    const datas = loadData();
    const filterData = datas.filter((elm) => elm.nama !== nama);
    saveDatas(filterData);
}

const updateData = (dataBaru) => {
    const datas = loadData();
    // hilangkan data lama yang namanya sama dengan oldName
    const filteredData = datas.filter((elm) => elm.nama !== dataBaru.oldName);
    
    delete dataBaru.oldName;
    filteredData.push(dataBaru);
    saveDatas(filteredData);
} 



module.exports = { loadData, findData, addData, cekDuplikat, deleteData, updateData }