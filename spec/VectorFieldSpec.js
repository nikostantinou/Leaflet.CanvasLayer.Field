describe('VectorField', function () {
    let Vector = L.Vector;
    let Cell = L.Cell;
    let VectorField = L.VectorField;

    let dataFolder = '../../docs/data';
    let vf;

    beforeEach(function (filesLoaded) {
        d3.text(`${dataFolder}/U.asc`, function (u) {
            d3.text(`${dataFolder}/V.asc`, function (v) {
                vf = VectorField.fromASCIIGrids(u, v);
                filesLoaded();
            });
        });
    });

    it('can be created from 2 ASCIIGrid files', function () {
        expect(vf).not.toBe(null);
    });

    it('can return the value for (i, j) indexes', function () {
        // top-left
        expect(vf._valueAtIndexes(0, 0)).toEqual(new Vector(0.011275325901806355, -0.003540651174262166));

        // botton-right
        expect(vf._valueAtIndexes(9, 9)).toEqual(new Vector(0.14851005375385284, -0.015279672108590603));
    });

    it('can return an interpolated value for a (lon, lat)', function () {
        // near the center of the LL cell [up & right]
        let pNearLL = vf.interpolatedValueAt(-3.76921724303, 43.4605948227);
        expect(pNearLL.u).toBeCloseTo(0.00586759205907583, 4);
        expect(pNearLL.v).toBeCloseTo(-0.00329965655691922, 4);

        // near the center of the UL cell [down & right]
        let pNearUL = vf.interpolatedValueAt(-3.76921740247, 43.4651398993);
        expect(pNearUL.u).toBeCloseTo(0.01127532590180643, 4);
        expect(pNearUL.v).toBeCloseTo(-0.00354065117426217, 4);

        // near the center of the UR cell [down & left]
        let pNearUR = vf.interpolatedValueAt(-3.76467191838, 43.4651400146);
        expect(pNearUR.u).toBeCloseTo(0.215018898248672, 4);
        expect(pNearUR.v).toBeCloseTo(-0.00158081843983382, 4);

        // near the center of the LR cell [up & left]
        let pNearLR = vf.interpolatedValueAt(-3.76467191746, 43.4605944395);
        expect(pNearLR.u).toBeCloseTo(0.148510053753853, 4);
        expect(pNearLR.v).toBeCloseTo(-0.0152796721085906, 4);
    });

    it('can return its cells', function () {
        let grid = vf.getCells();
        let p0 = grid[0];
        let pN = grid[grid.length - 1];

        let first = new Cell(L.latLng(43.4651400215155, -3.7692175003915),
            new Vector(0.011275325901806355, -0.003540651174262166), vf.cellSize);
        expect(p0.equals(first)).toBe(true);

        let last = new Cell(L.latLng(43.46059443161051, -3.7646719104864994),
            new Vector(0.14851005375385284, -0.015279672108590603), vf.cellSize);
        expect(pN.equals(last)).toBe(true);
    });

    it('can return a raster pyramid (resampled field)', function () {
        var allCells = vf.getPyramid(1);
        expect(allCells).toBe(vf);
        expect(allCells.getCells().length).toBe(100);

        var quarterCells = vf.getPyramid(2);
        expect(quarterCells).not.toBe(vf);
        expect(quarterCells.getCells().length).toBe(25);

        var nCells = vf.getPyramid(4);
        expect(nCells).not.toBe(vf);
        expect(nCells.getCells().length).toBe(9);
    });

    it('can calculate the Range of its values', function () {
        expect(vf.range).not.toBe(null);
        expect(vf.range[0]).toEqual(0.0067317434565905545);
        expect(vf.range[1]).toEqual(0.2150247092568961);
    });

    it('can return a ScalarField with its Magnitude or Direction', function () {
        let types = ['magnitude', 'directionTo', 'directionFrom'];
        for (var i = 0; i < 3; i++) {
            let s = vf.getScalarField(types[i]);
            expect(s).not.toBe(null);
        }
    });
});
