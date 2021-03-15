const graphql = require('graphql');
var _ = require('lodash');



//dummy data
var usersData = [
    {id: '1', name: "Bond", age: 36, profession: 'Programmer'},
    {id: '13', name: 'Anna', age: 26, profession: 'Baker'},
    {id: '211', name: 'Bella', age: 16, profession: 'Mechanic'},
    {id: '19', name: 'Gina', age: 26, profession: 'Painter'},
    {id: '150', name: 'Georgina', age: 36, profession: 'Teacher'}
];


var hobbiesData = [
    {id: '1', title: 'Programming', description: 'Using computers to make the world a better place', userId: '150'},
    {id: '2', title: 'Rowing', description: 'Sweat and feel better before eating donouts', userId: '211'},
    {id: '3', title: 'Swimming', description: 'Get in the water adn learn to become the water', userId: '211'},
    {id: '4', title: 'Fencing', description: 'A hobby for fency people', userId: '13'},
    {id: '5', title: 'Hiking', description: 'Wear hiking boots and explore the world', userId: '150'},


];

postsData = [
    {id: '1', comment: 'Building a Mind', userId: '1'},
    {id: '2', comment: 'GraphQL is Amazing', userId: '1'},
    {id: '3', comment: 'How to Change the world', userId: '19'},
    {id: '4', comment: 'How to Change the wordl', userId: '211'},
    {id: '5', comment: 'How to Change the wordl', userId: '1'}

];


const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
} = graphql


//Create types
const UserType = new GraphQLObjectType({
    name: "User",
    description: 'Documentation for user ....',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return _.filter(postsData, {userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return _.filter(hobbiesData, {userId: parent.id})
            }
        }
    })
});

//Create Hobby types
const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation for Hobby',
    fields: ()=> ({
        id: {type: GraphQLID},
        title: {type: GraphQLString },
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId})
            }
        }
    })
})

//Create comment type
const PostType = new GraphQLObjectType({
    name: 'Comment',
    description: 'Documentation for comments',
    fields: ()=> ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
              return  _.find(usersData, {id: parent.userId})
        
                // console.log("parent userId:", parent.userId)
                // var filteredPost = usersData.filter((post) => {
                //     console.log("post userid", post.id)
                //     return post.id == parent.userId
                // });
                // console.log("filtered post", filteredPost[0])
                // return filteredPost[0]
            }
        }
        
    })
});

//RootQuery

const RootQuery =  new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args){
             
                return _.find(usersData, {id: args.id})
                //we resolve with data
                //get and return data from a datasource
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //return data for our hobby
                return _.find(hobbiesData, {id: args.id})
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //return data for our comments
                return _.find(postsData, {id: args.id})
            }
        }
    }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID}
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}

            },
            resolve(parent, args){
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }
                return user;
            }

        }
    }
});




module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation

})