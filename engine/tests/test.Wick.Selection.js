describe('Wick.Selection', function() {
    it('should select/deselect objects', function () {
        var project = new Wick.Project();

        var path1 = new Wick.Path({json:TestUtils.TEST_PATH_JSON_RED_SQUARE});
        project.activeFrame.addPath(path1);
        var path2 = new Wick.Path({json:TestUtils.TEST_PATH_JSON_RED_SQUARE});
        project.activeFrame.addPath(path2);
        var path3 = new Wick.Path({json:TestUtils.TEST_PATH_JSON_RED_SQUARE});
        project.activeFrame.addPath(path3);

        var clip1 = new Wick.Clip();
        project.activeFrame.addClip(clip1);
        var clip2 = new Wick.Clip();
        project.activeFrame.addClip(clip2);

        var button1 = new Wick.Button();
        project.activeFrame.addClip(button1);
        var button2 = new Wick.Button();
        project.activeFrame.addClip(button2);

        var frame1 = project.activeFrame;
        frame1.end = 3;
        var frame2 = new Wick.Frame({start:4});
        project.activeLayer.addFrame(frame2);
        var frame3 = new Wick.Frame({start:5});
        project.activeLayer.addFrame(frame3);

        var tween1 = new Wick.Tween({start:1});
        project.activeFrame.addTween(tween1);
        var tween2 = new Wick.Tween({start:2});
        project.activeFrame.addTween(tween2);
        var tween3 = new Wick.Tween({start:3});
        project.activeFrame.addTween(tween3);

        var asset1 = new Wick.ImageAsset({
            filename: 'foo.png',
            src: TestUtils.TEST_IMG_SRC_PNG,
        });
        project.addAsset(asset1);
        var asset2 = new Wick.SoundAsset({
            filename: 'foo.mp3',
            src: TestUtils.TEST_SOUND_SRC_MP3,
        });
        project.addAsset(asset2);
        var asset3 = new Wick.ClipAsset({
            data: new Wick.Clip().export(),
        });
        project.addAsset(asset3);

        var layer1 = project.activeLayer;
        var layer2 = new Wick.Layer();
        project.root.timeline.addLayer(layer2);
        var layer3 = new Wick.Layer();
        project.root.timeline.addLayer(layer3);

        expect(project.selection.getSelectedObjects()).to.eql([]);
        expect(project.selection.numObjects).to.equal(0);

        expect(project.selection.isObjectSelected(path1)).to.equal(false);
        expect(project.selection.isObjectSelected(asset1)).to.equal(false);
        expect(project.selection.isObjectSelected(layer1)).to.equal(false);

        expect(project.selection.types).to.eql([]);
        expect(project.selection.location).to.equal(null);
        expect(project.selection.getSelectedObjects()).to.eql([]);

        project.selection.clear();
        expect(project.selection.getSelectedObjects()).to.eql([]);

        project.selection.select(frame1);
        expect(project.selection.getSelectedObjects()).to.eql([frame1]);
        expect(project.selection.isObjectSelected(frame1)).to.equal(true);
        expect(frame1.isSelected).to.equal(true);
        expect(project.selection.isObjectSelected(frame2)).to.equal(false);
        expect(frame2.isSelected).to.equal(false);

        expect(project.selection.types).to.eql(['Frame']);
        expect(project.selection.location).to.equal('Timeline');
        expect(project.selection.getSelectedObjects()).to.eql([frame1]);

        project.selection.select(layer1);
        expect(project.selection.numObjects).to.equal(2);
        expect(project.selection.getSelectedObjects()).to.eql([frame1, layer1]);
        expect(project.selection.types).to.eql(['Frame', 'Layer']);
        expect(project.selection.location).to.equal('Timeline');

        project.selection.select(layer2);
        expect(project.selection.getSelectedObjects()).to.eql([frame1, layer1, layer2]);
        expect(project.selection.types).to.eql(['Frame', 'Layer']);
        expect(project.selection.location).to.equal('Timeline');

        project.selection.select(asset1);
        expect(project.selection.getSelectedObjects()).to.eql([asset1]);
        expect(project.selection.types).to.eql(['ImageAsset']);
        expect(project.selection.location).to.equal('AssetLibrary');

        project.selection.select(asset2);
        expect(project.selection.getSelectedObjects()).to.eql([asset1, asset2]);
        expect(project.selection.types).to.eql(['ImageAsset', 'SoundAsset']);
        expect(project.selection.location).to.equal('AssetLibrary');

        project.selection.select(path1);
        project.selection.select(path2);
        project.selection.select(path3);
        expect(project.selection.getSelectedObjects()).to.eql([path1, path2, path3]);
        expect(project.selection.numObjects).to.eql(3);
        expect(project.selection.types).to.eql(['Path']);
        expect(project.selection.location).to.equal('Canvas');

        project.selection.select(clip1);
        project.selection.select(button1);
        expect(project.selection.numObjects).to.eql(5);
        expect(project.selection.types).to.eql(['Path', 'Clip', 'Button']);
        expect(project.selection.location).to.equal('Canvas');
        expect(project.selection.getSelectedObjects()).to.eql([path1, path2, path3, clip1, button1]);

        project.selection.clear();
        expect(project.selection.getSelectedObjects()).to.eql([]);
    });

    it('should change selection transforms correctly', function () {
        // TODO
        // x, y, width, height, rotation
    });

    it('should flip selection correctly', function () {
        // todo vertical, horizontal
    });

    it('should reorder selection correctly', function () {
        // todo sendtoback, bringtofront, etc
    });

    it('should change selection attributes correctly', function () {
        // TODO
        // opacity, fillColor, strokeColor, strokeWidth
    });

    it('should change to cursor tool when selection changes (canvas object)', function () {
        // TODO
    });

    it('should not change to cursor tool when selection changes (timeline/assets)', function () {
        // TODO
    });

    it('should activate the layer that a newly selected canvas object belongs to', function () {
        // TODO
    });

    it('should change the tween easing type correctly', function () {
        // TODO
        // easingType
    });

    it('should select frames between frames if multple frames are selected', function () {
        var project = new Wick.Project();
        var frame1 = project.activeFrame;
        var frame2 = new Wick.Frame({start:2});
        var frame3 = new Wick.Frame({start:3});
        var frame4 = new Wick.Frame({start:4});
        var frame5 = new Wick.Frame({start:5});
        project.activeLayer.addFrame(frame2);
        project.activeLayer.addFrame(frame3);
        project.activeLayer.addFrame(frame4);
        project.activeLayer.addFrame(frame5);

        project.selection.select(frame2);
        expect(project.selection.getSelectedObjects().length).to.equal(1);
        expect(project.selection.isObjectSelected(frame2));

        project.selection.select(frame4);
        expect(project.selection.getSelectedObjects().length).to.equal(3);
        expect(project.selection.isObjectSelected(frame2));
        expect(project.selection.isObjectSelected(frame3));
        expect(project.selection.isObjectSelected(frame4));
    });

    describe('#getRightmostFrames', function () {
        it('should return rightmost frames', function () {
            // TODO
        });
    });

    describe('#getLeftmostFrames', function () {
        it('should return leftmost frames', function () {
            // TODO
        });
    });

    it('should automatically create tweens when objects are moved on a tweened frame (one tween)', function () {
        var project = new Wick.Project();

        var frame = project.activeFrame;
        frame.end = 10;

        var clip = new Wick.Clip();
        frame.addClip(clip);

        var tweenA = new Wick.Tween({
            playheadPosition: 1,
            transformation: new Wick.Transformation({
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                opacity: 1,
            }),
            fullRotations: 0,
        });
        frame.addTween(tweenA);

        project.activeTimeline.playheadPosition = 5;
        project.selection.select(clip);
        project.view.render();
        project.selection.x = 300;
        project.selection.y = 300;

        expect(frame.clips.length).to.equal(1);
        expect(frame.clips[0]).to.equal(clip);

        expect(frame.getTweenAtPosition(1)).to.equal(tweenA);
        expect(frame.getTweenAtPosition(5).transformation.x).to.equal(300);
        expect(frame.getTweenAtPosition(5).transformation.y).to.equal(300);
    });

    it('should automatically create tweens when objects are moved on a tweened frame (between two tweens)', function () {
        // TODO

        /*
        var project = new Wick.Project();

        var frame = project.activeFrame;
        frame.end = 10;

        var clip = new Wick.Clip();
        frame.addClip(clip);

        var tweenA = new Wick.Tween({
            playheadPosition: 1,
            transformation: new Wick.Transformation({
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                opacity: 1,
            }),
            fullRotations: 0,
        });
        var tweenB = new Wick.Tween({
            playheadPosition: 9,
            transformation: new Wick.Transformation({
                x: 400,
                y: 300,
                scaleX: 2,
                scaleY: 0.5,
                rotation: 180,
                opacity: 0.0,
            }),
            fullRotations: 0,
        });
        frame.addTween(tweenA);
        frame.addTween(tweenB);

        project.activeTimeline.playheadPosition = 5;
        project.selection.select(clip);
        project.view.render();
        project.selection.x = 150;
        project.selection.y = 250;
        project.activeTimeline.playheadPosition = 6;
        project.activeTimeline.playheadPosition = 5;

        expect(frame.clips.length).to.equal(1);
        expect(frame.clips[0]).to.equal(clip);

        expect(frame.tweens.length).to.equal(3);
        expect(frame.getTweenAtPosition(1)).to.equal(tweenA);
        expect(frame.getTweenAtPosition(9)).to.equal(tweenB);
        expect(frame.getTweenAtPosition(5).transformation.x).to.equal(150);
        expect(frame.getTweenAtPosition(5).transformation.y).to.equal(250);
        */
    });
});
