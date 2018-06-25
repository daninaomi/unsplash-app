
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import PicturesFeed from '../components/PicturesFeed'

const width = Dimensions.get('screen').width;

export default class Home extends Component {

    constructor() {
        super()
        this.state = {
            fotosCurated: [],
            fotos: [],
            msg: '',
            isLoading: true,
            fetchingStatus: false
        }
        this.page = 1
    }

    componentDidMount() {
        fetch('https://api.unsplash.com/photos/curated?page=1&per_page=5&client_id=d2f9218a71fd93fb4b0cab51fd5b0bb3ec38100443ee5577787a278cd7b6d394')
            .then(res => res.json())
            .then(response => {
                // console.warn(response)
                this.setState({
                    ...this.state.fotosCurated,
                    fotosCurated: response
                })
            }
            )
            .catch(erro => {
                this.setState({
                    msg: erro
                })
            })

        fetch(`https://api.unsplash.com/photos?page=${this.page}&client_id=d2f9218a71fd93fb4b0cab51fd5b0bb3ec38100443ee5577787a278cd7b6d394`)
            .then(res => res.json())
            .then(response => {
                // console.warn(response)
                this.setState({
                    ...this.state.fotos,
                    fotos: response,
                    isLoading: false
                })
            }
            )
            .catch(erro => {
                this.setState({
                    msg: erro
                })
            })
    }

    loadMorePictures = () => {
        this.page = this.page + 1;

        this.setState({ fetchingStatus: true }, () => {
            fetch(`https://api.unsplash.com/photos?page=${this.page}&client_id=d2f9218a71fd93fb4b0cab51fd5b0bb3ec38100443ee5577787a278cd7b6d394`)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        fotos: [...this.state.fotos, ...responseJson],
                        fetchingStatus: false
                    });
                })
                .catch((error) => {
                    console.error(error);
                });

        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>

                <Text style={styles.title}>
                    Bem-vindx {"\n"}
                    à seu feed
                </Text>

                <Text style={styles.subtitle}>
                    Features
                </Text>

                <View style={styles.featuresSection}>
                    <FlatList
                        keyExtractor={item => item.id}
                        data={this.state.fotosCurated}
                        horizontal={true}
                        renderItem={({ item }) =>

                            <View>
                                <Image style={styles.featuredPics}
                                    source={{ uri: item.urls.small }} />
                            </View>
                        }
                    />
                </View>

                {
                    (this.state.isLoading)
                        ?
                        (<ActivityIndicator size="large" />)
                        :
                        (
                            <PicturesFeed fotos={this.state.fotos}
                                // footer={this.renderFooter}
                                loadMorePictures={this.loadMorePictures}
                                fetchingStatus={this.state.fetchingStatus}
                            />
                        )
                }

                <Text >
                    {this.state.msg}
                </Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    title: {
        margin: 15,
        marginTop: 30,
        marginBottom: 25,
        fontSize: 22
    },
    subtitle: {
        padding: 15,
        backgroundColor: '#5E5E5E',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    featuresSection: {
        padding: 15,
        backgroundColor: '#5E5E5E'
    },
    featuredPics: {
        width: width / 2,
        height: width / 2
    },
    photoCard: {
        // flexDirection: 'row',
        marginTop: 15,
        marginLeft: 15
    },
    photoDescription: {
        marginBottom: 5,
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    imagem: {
        width: (width) - 25,
        height: (width / 2) - 25
    }
});
