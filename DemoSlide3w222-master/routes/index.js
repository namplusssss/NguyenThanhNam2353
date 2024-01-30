var express = require('express');
var router = express.Router();
// 1 tạo csdl mongodb
// mở kết nối , truy vấn vào bảng trên csdl
// trả về dữ liệu dạng JSON
// tập viết API cho ứng dụng mobile
/* GET home page. */

const urlDB = "mongodb+srv://Nam2353:Namnt2353@model1.jvrz8ai.mongodb.net/?retryWrites=true&w=majority"

// mở kết nối bằng thư viện mongosse
var mongoose = require('mongoose') // click chữ mongoosee , bấm Alt + Enter để cài thư viện vào project

// Kết nối tới cơ sở dữ liệu MongoDB
mongoose.connect(urlDB, {});
// Lấy kết nối
const db = mongoose.connection;

// Xử lý lỗi kết nối
db.on('error', console.error.bind(console, 'Lỗi kết nối MongoDB'));

// Xác nhận kết nối thành công
db.once('open', function () {
    console.log('Kết nối thành công');
});

// định nghĩa đối tượng - collection - document
// định nghĩa cấu trúc của document
// Schema !!! định nghĩa các cặp giá trị thể thiện thông tin
// key : value
// tạo 1 Schema Student :
var student
    = new mongoose.Schema({
    name: String,
    hoTen: String,
    number: String,
    address: String,
    birthday: Date
});
// Liên kết Schema với DB
const Student = mongoose.model('student', student);

router.get('/showInsertStudentForm',
    function (req, res) {
        res.render('insert')
})

router.post('/insertStudent',function (req,res) {
  // lay du lieu tu form
  // // ket noi vao database , tao Sinh vien
  //   <input name="name" placeholder="Nhập tên sinh viên ..."/>
  //   <input name="hoten" placeholder="Nhâp họ sinh viên...">
  //       <input name="number" placeholder="Nhâp sdt sinh viên...">
  //           <input name="address" placeholder="Nhâp địa chỉ sinh viên...">
    var name = req.body.name
    var hoten = req.body.hoten
    var number = req.body.number
    var address = req.body.address
    var birthday = req.body.birthday

    var stun = new Student({
        name : name,
        hoTen : hoten,
        number : number,
        address : address,
        birthday : birthday
    })

    stun.save().then(()=>{
        res.send('Them thanh cong!!!')
    }).catch(error =>{
        res.send('Them that bai ' + error.message)
    })
})

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/getListStudentAPI',function (req,res) {
    var students = Student.find({}).then((data)=>{
        res.send(data);
    }).catch(error => {
        res.send('Co loi xay ra')
    })
})

router.get('/showListStudent',function (req,res) {
   Student.find({}).then((data)=>{
        res.render('liststudent',{value : data});
    }).catch(error => {
        res.send('Co loi xay ra')
    })
})
router.get('/deleteStudent',function (req,res) {
    const id = req.query.id;
    Student.deleteOne({_id : id})
        .then(()=>{
        res.redirect('/');
    }).catch(error =>{
        res.send('co loi xay ra');
    })
})

router.get('/showEditStudent',function (req,res) {
    const id = req.query.id;
    Student.find({_id : id}).then(data =>{
        console.log(data)
        res.render('editstudent',{sinhvien : data[0]})
    }).catch(error => {
        res.send('Co loi xay ra');
    })

})
router.post('/editStudent',function (req,res) {
    const id = req.body.id;
    var name = req.body.name
    var hoten = req.body.hoten
    var number = req.body.number
    var address = req.body.address
    var birthday = req.body.birthday;
    console.log(id)

    var stun = new Student({
        name : name,
        hoten : hoten,
        number : number,
        address : address,
        birthday : birthday
    })
    Student.findByIdAndUpdate(id, {
        name : name,
        hoten : hoten,
        number : number,
        address : address,
        birthday : birthday }, null)
        .then(updatedDoc => {
            // xử lý khi cập nhật thành công
            console.log(updatedDoc)
            res.redirect('/showListStudent')
        })
        .catch(err => {
            // xử lý lỗi
            res.send('co loi xay ra')
        });


})

module.exports = router;
