        function getLayoutPositions(layout) {
            // Default logo state for templates that don't specify one.
            const noLogo = { src: null, position: 'bottom-left', scale: 0.15 };

            switch(layout) {
                case 1: // Traditional vertical stack
                    return {
                        text: [
                            { x: 960, y: 244, align: 'center', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 440, align: 'center', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 647, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 883, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }
                        ],
                        logo: { src: 'logo1.png', position: 'top-left', scale: 0.20 } // Example: Layout 1 uses logo1 at 20% in top-left
                    , objects: []
};
                case 2: // Side by side top lines
                    return {
                        text: [
                            { x: 960, y: 244, align: 'center', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 440, align: 'center', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 647, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 883, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }
                        ],
                        logo: { src: 'logo2.png', position: 'bottom-right', scale: 0.12 } // Example: Layout 2 uses logo2 at 12% in bottom-right
                    , objects: []
};
                case 3: // Right-aligned stack
                    return {
                        text: [
                            { x: 960, y: 244, align: 'center', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 440, align: 'center', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 647, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 },
                            { x: 960, y: 883, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }
                        ],
                        logo: noLogo // Example: Layout 3 has no logo
                        , objects: []

                    };
                // --- Continue this pattern for all other cases ---
                case 4:
                    return { text: [ { x: 491, y: 265, align: 'center', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1882, y: 265, align: 'right', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 459, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 949, y: 747, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 5:
                    return { text: [ { x: 75, y: 245, align: 'left', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1824, y: 245, align: 'right', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 459, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 949, y: 731, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 6:
                    return { text: [ { x: 960, y: 244, align: 'center', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 440, align: 'center', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 616, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 50, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 846, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 7:
                    return { text: [ { x: 38, y: 10, align: 'left', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1882, y: 10, align: 'right', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 150, align: 'center', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 960, y: 851, align: 'center', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(200,0,0,0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 8:
                    return { text: [ { x: 38, y: 83, align: 'left', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 38, y: 282, align: 'left', wrap: false, color: '#04ff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(0, 0, 0, 1)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 38, y: 500, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 255, 0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1882, y: 783, align: 'right', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(255, 0, 0, 1)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 9:
                    return { text: [ { x: 1882, y: 83, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1882, y: 282, align: 'right', wrap: false, color: '#04ff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(0, 0, 0, 1)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1882, y: 500, align: 'right', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 255, 0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 38, y: 783, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(255, 0, 0, 1)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 10:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 624, y: 559, align: 'left', wrap: false, color: '#ff1100', strokeColor: '#ffffff', strokeThickness: 70, bgColor: 'rgba(0, 0, 0, 0)', bgFullWidth: true, bgPadding: 37, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1882, y: 500, align: 'right', wrap: false, color: '#ffffff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 255, 0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 1676, y: 621, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(255, 0, 0, 0)', bgFullWidth: false, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 11:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(219, 143, 10,0)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(219, 143, 10, 0)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(219, 143, 10, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: { src: 'logo5.png', position: 'bottom-left', scale: 0.17 } , objects: []
};
                case 12:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(14, 219, 10,0)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(14, 219, 10, 0)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(14, 219, 10, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: { src: 'logo5.png', position: 'bottom-left', scale: 0.17 } , objects: []
};
                case 13:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(216, 10, 219,0)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(216, 10, 219, 0)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(216, 10, 219, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: { src: 'logo7.png', position: 'bottom-left', scale: 0.17 } , objects: []
};
                case 14:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 0,0)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 0, 0)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(255, 255, 0, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: { src: 'logo5.png', position: 'bottom-left', scale: 0.17 }, objects: []
};
                case 15:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(0,0,0,0)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(0,0,0,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ff0000', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 0, 0, 0)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(0, 0, 0, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: { src: 'logo7.png', position: 'bottom-left', scale: 0.17 } , objects: []
};
                case 16:
                    return { text: [
                            {
                                x: 940, y: 11, align: 'right', wrap: false,
                                color: '#0000ff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(219, 143, 10,0.8)', bgFullWidth: true, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 975, y: 11, align: 'left', wrap: false,
                                color: '#ffff00',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 6, y: 158, align: 'left', wrap: false,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(219, 143, 10, 0.8)', bgFullWidth: false, bgPadding: 5,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 371, y: 883, align: 'left', wrap: true,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 8,
                                bgColor: 'rgba(219, 143, 10, 0.8)', bgFullWidth: true, bgPadding: 30,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            }
                        ],
                        logo: { src: 'logo5.png', position: 'bottom-left', scale: 0.17 },
                objects: []
                    };
                case 17:
                    return {
                        text: [
                            {
                                x: 940, y: 11, align: 'right', wrap: false,
                                color: '#0000ff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(14, 219, 10,0.8)', bgFullWidth: true, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 975, y: 11, align: 'left', wrap: false,
                                color: '#ffff00',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 6, y: 160, align: 'left', wrap: false,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(14, 219, 10, 0.8)', bgFullWidth: false, bgPadding: 5,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 371, y: 883, align: 'left', wrap: true,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 8,
                                bgColor: 'rgba(14, 219, 10, 0.8)', bgFullWidth: true, bgPadding: 30,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            }
                        ],
                        logo: { src: 'logo5.png', position: 'bottom-left', scale: 0.17 },
                objects: []
                    };
                case 18:
                    return {
                        text: [
                            {
                                x: 940, y: 11, align: 'right', wrap: false,
                                color: '#0000ff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(216, 10, 219,0.8)', bgFullWidth: true, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 975, y: 11, align: 'left', wrap: false,
                                color: '#ffff00',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 6, y: 160, align: 'left', wrap: false,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(216, 10, 219, 0.8)', bgFullWidth: false, bgPadding: 5,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 371, y: 883, align: 'left', wrap: true,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 8,
                                bgColor: 'rgba(216, 10, 219, 0.8)', bgFullWidth: true, bgPadding: 30,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            }
                        ],
                        logo: { src: 'logo7.png', position: 'bottom-left', scale: 0.17 },
                objects: []
                    };
                case 19:
                    return {
                        text: [
                            {
                                x: 940, y: 11, align: 'right', wrap: false,
                                color: '#0000ff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255, 255, 0,0.8)', bgFullWidth: true, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 975, y: 11, align: 'left', wrap: false,
                                color: '#ffff00',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 6, y: 160, align: 'left', wrap: false,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255, 255, 0, 0.8)', bgFullWidth: false, bgPadding: 5,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 371, y: 883, align: 'left', wrap: true,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 8,
                                bgColor: 'rgba(255, 255, 0, 0.8)', bgFullWidth: true, bgPadding: 30,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            }
                        ],
                        logo: { src: 'logo5.png', position: 'bottom-left', scale: 0.17 },
                objects: []
                    };
                case 20:
                    return {
                        text: [
                            {
                                x: 940, y: 11, align: 'right', wrap: false,
                                color: '#0000ff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(0,0,0,0.8)', bgFullWidth: true, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 975, y: 11, align: 'left', wrap: false,
                                color: '#ffff00',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(0,0,0,0)', bgFullWidth: false, bgPadding: 10,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 6, y: 160, align: 'left', wrap: false,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 10,
                                bgColor: 'rgba(255, 0, 0, 1)', bgFullWidth: false, bgPadding: 5,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            },
                            {
                                x: 371, y: 883, align: 'left', wrap: true,
                                color: '#ffffff',
                                strokeColor: '#000000', strokeThickness: 8,
                                bgColor: 'rgba(0, 0, 0, 0.8)', bgFullWidth: true, bgPadding: 30,
                                shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10
                            }
                        ],
                        logo: { src: 'logo7.png', position: 'bottom-left', scale: 0.17 },
                objects: []
                    };
                case 21:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(219, 143, 10,0.8)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ffffff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(219, 143, 10, 0.8)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(219, 143, 10, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 22:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(14, 219, 10,0.8)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ffffff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(14, 219, 10, 0.8)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(14, 219, 10, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 23:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(216, 10, 219,0.8)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ffffff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(216, 10, 219, 0.8)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(216, 10, 219, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 24:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 0,0.8)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ffffff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 255, 0, 0.8)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(255, 255, 0, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: []
};
                case 25:
                    return { text: [ { x: 940, y: 11, align: 'right', wrap: false, color: '#0000ff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(0,0,0,0)', bgFullWidth: true, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 975, y: 11, align: 'left', wrap: false, color: '#ffff00', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(0,0,0,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 10, y: 158, align: 'left', wrap: false, color: '#ffffff', strokeColor: '#000000', strokeThickness: 10, bgColor: 'rgba(255, 0, 0, 1)', bgFullWidth: false, bgPadding: 5, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 }, { x: 371, y: 883, align: 'left', wrap: true, color: '#ffffff', strokeColor: '#000000', strokeThickness: 8, bgColor: 'rgba(0, 0, 0, 0.8)', bgFullWidth: true, bgPadding: 30, shadowEnabled: true, shadowColor: 'rgba(0, 0, 0, 0.8)', shadowBlur: 0, shadowOffsetX: 10, shadowOffsetY: 10 } ], logo: noLogo , objects: [] };
                default:
                    console.warn("Layout not found, using default preset.");
                    return {
                        text: [
                            { x: 960, y: 150, align: 'center', wrap: false, color: '#FFFFFF', strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 },
                            { x: 960, y: 350, align: 'center', wrap: false, color: '#FFFFFF', strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 },
                            { x: 960, y: 550, align: 'center', wrap: false, color: '#FFFFFF', strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 },
                            { x: 960, y: 750, align: 'center', wrap: true,  color: '#FFFFFF', strokeColor: '#000000', strokeThickness: 2, bgColor: 'rgba(255,255,255,0)', bgFullWidth: false, bgPadding: 10, shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2 }
                        ],
                        logo: noLogo
                    };
            }
        }