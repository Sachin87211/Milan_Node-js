exports.successResponse = (res, msg) => {
    var data = {
        status: 200,
        message: msg
    };
    return res.status(200).json(data);
}
exports.successResponseWithOtp = (res, msg,otp) => {
    var data = {
        status: 200,
        message: msg,
        otp
    };
    return res.status(200).json(data);
}

exports.successResponseWithData = (res, msg, data) => {
    var data = {
        status: 200,
        message: msg,
        data: data
    };
    return res.status(200).json(data);
}

exports.successResponseWithExtraData = (res, msg, data, extraData) => {
    var data = {
        status: 200,
        message: msg,
        data: data,
        extraData: extraData
    };
    return res.status(200).json(data);
}

exports.successResponseWithDataAndToken = (res, msg, data, token) => {
    var data = {
        status: 200,
        message: msg,
        data: data,
        token: token
    };
    return res.status(200).json(data);
}

exports.errorResponse = (res, msg) => {
    var data = {
        status: 400,
        message: msg
    };
    return res.status(400).json(data);
}

exports.errorResponseWithData = (res, msg, data) => {
    var data = {
        status: 400,
        message: msg,
        data: data
    };
    return res.status(400).json(data);
}

exports.validationError = (res, msg) => {
    var data = {
        status: 422,
        message: msg
    };
    return res.status(422).json(data);
}

exports.validationErrorWithData = (res, msg, data) => {
    var data = {
        status: 422,
        message: msg,
        data: data
    };
    return res.status(422).json(data);
}

exports.catchedErrorResponse = (res, msg) => {
    var data = {
        status: 500,
        message: msg,
    };
    return res.status(500).json(data);
}

exports.unAuthorizedResponse = (res, msg) => {
    var data = {
        status: 401,
        message: msg,
    };
    return res.status(401).json(data);
}