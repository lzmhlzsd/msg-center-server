!function(e){function t(r){if(a[r])return a[r].exports;var n=a[r]={exports:{},id:r,loaded:!1};return e[r].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var a={};return t.m=e,t.c=a,t.p="/public/dist/js/",t(0)}([function(e,t,a){e.exports=a(1)},function(e,t,a){try{(function(){"use strict";function e(){return!1}var t=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},r=a(2),n=r.Form.create,o=r.Form.Item,s=React.createClass({displayName:"BasicDemo",handleReset:function(e){e.preventDefault(),this.props.form.resetFields()},handleSubmit:function(e){e.preventDefault(),this.props.form.validateFields(function(e,t){return e?void console.log("Errors in form!!!"):(console.log("Submit!!!"),void console.log(t))})},userExists:function(e,t,a){t?setTimeout(function(){"JasonWood"===t?a([new Error("抱歉，该用户名已被占用。")]):a()},800):a()},checkPass:function(e,t,a){var r=this.props.form.validateFields;t&&r(["rePasswd"],{force:!0}),a()},checkPass2:function(e,t,a){var r=this.props.form.getFieldValue;t&&t!==r("passwd")?a("两次输入密码不一致！"):a()},render:function(){var a=this.props.form,n=a.getFieldProps,s=a.getFieldError,l=a.isFieldValidating,c=n("name",{rules:[{required:!0,min:5,message:"用户名至少为 5 个字符"},{validator:this.userExists}]}),i=n("email",{validate:[{rules:[{required:!0}],trigger:"onBlur"},{rules:[{type:"email",message:"请输入正确的邮箱地址"}],trigger:["onBlur","onChange"]}]}),p=n("passwd",{rules:[{required:!0,whitespace:!0,message:"请填写密码"},{validator:this.checkPass}]}),u=n("rePasswd",{rules:[{required:!0,whitespace:!0,message:"请再次输入密码"},{validator:this.checkPass2}]}),d=n("textarea",{rules:[{required:!0,message:"真的不打算写点什么吗？"}]}),m={labelCol:{span:7},wrapperCol:{span:12}};return React.createElement(r.Form,{horizontal:!0,form:this.props.form},React.createElement(o,t({},m,{label:"用户名",hasFeedback:!0,help:l("name")?"校验中...":(s("name")||[]).join(", ")}),React.createElement(r.Input,t({},c,{placeholder:"实时校验，输入 JasonWood 看看"}))),React.createElement(o,t({},m,{label:"邮箱",hasFeedback:!0}),React.createElement(r.Input,t({},i,{type:"email",placeholder:"onBlur 与 onChange 相结合"}))),React.createElement(o,t({},m,{label:"密码",hasFeedback:!0}),React.createElement(r.Input,t({},p,{type:"password",autoComplete:"off",onContextMenu:e,onPaste:e,onCopy:e,onCut:e}))),React.createElement(o,t({},m,{label:"确认密码",hasFeedback:!0}),React.createElement(r.Input,t({},u,{type:"password",autoComplete:"off",placeholder:"两次输入密码保持一致",onContextMenu:e,onPaste:e,onCopy:e,onCut:e}))),React.createElement(o,t({},m,{label:"备注"}),React.createElement(r.Input,t({},d,{type:"textarea",placeholder:"随便写",id:"textarea",name:"textarea"}))),React.createElement(o,{wrapperCol:{span:12,offset:7}},React.createElement(r.Button,{type:"primary",onClick:this.handleSubmit},"确定"),"   ",React.createElement(r.Button,{type:"ghost",onClick:this.handleReset},"重置")))}});s=n()(s),ReactDOM.render(React.createElement(s,null),document.getElementById("app"))}).call(this)}finally{}},function(e,t){e.exports=antd}]);