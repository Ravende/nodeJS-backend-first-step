const paginator = require("../utils/paginator");
const { ObjectId } = require("mongodb");

// 글쓰기
async function writePost(collection, post) {   // 글쓰기 함수
    post.hits = 0;
    post.createdDt = new Date().toISOString(); // 날짜는 ISO 포맷으로 저장
    return await collection.insertOne(post);   // 몽고디비에 post를 저장 후 결과 반환
}

// 글 목록
async function list(collection, page, search) {
    const perPage = 10;
    const query = { title: new RegExp(search, "i") };  // title이 search와 부분일치하는지 확인
    // 생성일 역순으로 정렬
    const cursor = collection
        .find(query, { limit: perPage, skip: (page - 1) * perPage })
        .sort({   // limit는 10개만 가져온다는 의미, skip은 설정된 개수만큼 건너뛴다
        createdDt: -1,
    });
    const totalCount = await collection.countDocuments(query);  // 검색어에 걸리는 게시물의 총합. count() -> countDocuments()
    const posts = await cursor.toArray();              // 커서로 받아온 데이터를 리스트로 변경
    const paginatorObj = paginator({ totalCount, page, perPage: perPage });   // 페이지네이터 생성
    return [posts, paginatorObj];
}

const projectionOption = {
    projection: {          // 프로젝션(투영) 결괏값에서 일부만 가져올 때 사용
        password: 0,       // 패스워드는 노출할 필요가 없으므로 결괏값으로 가져오지 않음
        "comments.password": 0,
    },
};
async function getDetailPost(collection, id) {   // 몽고디비 Collection의 findOneAndUpdate() 함수를 사용
    return await collection.findOneAndUpdate(    // 게시글을 읽을 때마다 hits를 1 증가
        { _id: new ObjectId(id) },   // --> ObjectId 객체 전부 new 앞에 붙여 수정
        { $inc: { hits: 1 } }, 
        projectionOption
    );
};

async function getPostByIdAndPassword(collection, { id, password }) {
    return await collection.findOne({ _id: new ObjectId(id), password: password }, projectionOption);   // findOne() 함수 사용
}

// id로 데이터 불러오기
async function getPostById(collection, id) {
    return await collection.findOne({ _id: new ObjectId(id) }, projectionOption);
}

// 게시글 수정
async function updatePost(collection, id, post) {
    const toUpdatePost = {
        $set: {
            ...post,
        },
    };
    return await collection.updateOne({ _id: new ObjectId(id) }, toUpdatePost);
}


module.exports = {  // require()로 임포트 시 외부로 노출하는 객체
    list,
    writePost,
    getDetailPost,
    getPostById,
    getPostByIdAndPassword,
    updatePost,
};