import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    VrButton,
} from 'react-360';
import {BLACK, BLUE, CYAN, GREEN, MODE_DRAW, MODE_ERASE, MODE_NOTE, PINK, RED, WHITE, YELLOW} from "../common/Color";
import {browserBridgeIndex} from "../module/BrowserBridgeIndex";

export default class HeadLockMenu360 extends React.Component {

    state = {
        open: true,
        color: RED,
        mode: MODE_DRAW
    };

    setColor(event, color: string) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({color: color})
        browserBridgeIndex.emit("colorChange", color);
    }

    setMode(event, mode: string) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({mode: mode})
        browserBridgeIndex.emit("modeChange", mode);
    }


    render() {
        return (
            <React.Fragment>
                {
                    this.state.open &&
                    <View style={styles.panel}>
                        <View style={styles.greetingBox}>
                            <Text style={styles.greeting}>
                                Welcome to Aptero Virtual Meeting Room.
                                Share the url of this page to allow someone to connect.
                                Please use Oculus Quest or Firefox with Oculus Rift for a full VR experience.
                            </Text>
                        </View>

                        {this.state.mode === MODE_DRAW &&
                        <View style={styles.colorsBox}>
                            <VrButton style={this.state.color === RED ? styles.redSelected : styles.red}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, RED)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === GREEN ? styles.greenSelected : styles.green}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, GREEN)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === BLUE ? styles.blueSelected : styles.blue}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, BLUE)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === PINK ? styles.pinkSelected : styles.pink}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, PINK)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === YELLOW ? styles.yellowSelected : styles.yellow}

                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, YELLOW)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === CYAN ? styles.cyanSelected : styles.cyan}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, CYAN)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === BLACK ? styles.blackSelected : styles.black}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, BLACK)
                                      }}>
                            </VrButton>
                            <VrButton style={this.state.color === WHITE ? styles.whiteSelected : styles.white}
                                      onButtonPress={() => {
                                          browserBridgeIndex.emit("vrButtonStart", {});
                                      }}
                                      onButtonRelease={() => {
                                          browserBridgeIndex.emit("vrButtonStop", {});
                                      }}
                                      onClick={(event) => {
                                          this.setColor(event, WHITE)
                                      }}>
                            </VrButton>
                        </View>
                        }

                        <View style={styles.colorsModeBox}>
                            <VrButton
                                style={this.state.mode === MODE_DRAW ? styles.modeButtonSelected : styles.modeButton}

                                onButtonPress={() => {
                                    browserBridgeIndex.emit("vrButtonStart", {});
                                }}
                                onButtonRelease={() => {
                                    browserBridgeIndex.emit("vrButtonStop", {});
                                }}
                                onClick={(event) => {
                                    this.setMode(event, MODE_DRAW)
                                }}><Text>Draw</Text></VrButton>
                            <VrButton
                                style={this.state.mode === MODE_ERASE ? styles.modeButtonSelected : styles.modeButton}
                                onButtonPress={() => {
                                    browserBridgeIndex.emit("vrButtonStart", {});
                                }}
                                onButtonRelease={() => {
                                    browserBridgeIndex.emit("vrButtonStop", {});
                                }}
                                onClick={(event) => {
                                    this.setMode(event, MODE_ERASE)
                                }}><Text>Erase</Text></VrButton>
                            <VrButton
                                style={this.state.mode === MODE_NOTE ? styles.modeButtonSelected : styles.modeButton}
                                onButtonPress={() => {
                                    browserBridgeIndex.emit("vrButtonStart", {});
                                }}
                                onButtonRelease={() => {
                                    browserBridgeIndex.emit("vrButtonStop", {});
                                }}
                                onClick={(event) => {
                                    this.setMode(event, MODE_NOTE)
                                }}><Text>Note</Text></VrButton>
                        </View>
                    </View>
                }
            </React.Fragment>
        );
    }
};

const styles = StyleSheet.create({
    panel: {
        // Fill the entire surface
        width: 1000,
        height: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingBox: {
        margin: 20,
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
    },
    colorsModeBox: {
        flex: 1, flexDirection: 'row',
        marginTop: 0,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    colorsBox: {
        flex: 1, flexDirection: 'row',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 20
    },
    modeButton: {
        marginLeft: 20,
        marginRight: 20,
        width: 200,
        height: 50,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeButtonSelected: {
        marginLeft: 20,
        marginRight: 20,
        width: 200,
        height: 50,
        backgroundColor: '#000000',
        borderColor: '#dacc00',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    red: {
        padding: 20,
        backgroundColor: '#FF0000',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    redSelected: {
        padding: 20,
        backgroundColor: '#FF0000',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    green: {
        padding: 20,
        backgroundColor: '#00FF00',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    greenSelected: {
        padding: 20,
        backgroundColor: '#00FF00',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    blue: {
        padding: 20,
        backgroundColor: '#0000FF',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    blueSelected: {
        padding: 20,
        backgroundColor: '#0000FF',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    pink: {
        padding: 20,
        backgroundColor: '#ff00ff',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    pinkSelected: {
        padding: 20,
        backgroundColor: '#ff00ff',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    cyan: {
        padding: 20,
        backgroundColor: '#00FFFF',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    cyanSelected: {
        padding: 20,
        backgroundColor: '#00FFFF',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    yellow: {
        padding: 20,
        backgroundColor: '#FFFF00',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    yellowSelected: {
        padding: 20,
        backgroundColor: '#FFFF00',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    white: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    whiteSelected: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    black: {
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 2,
        width: 50, height: 50
    },
    blackSelected: {
        padding: 20,
        backgroundColor: '#000000',
        borderColor: '#dacc00',
        borderWidth: 2,
        width: 50, height: 50
    },
    greeting: {
        fontSize: 30,
    },
});

