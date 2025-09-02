<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Dflydev\DotAccessData\Data;
use Illuminate\Http\Client\ResponseSequence;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class KelurahanController extends Controller
{
    /**
     * Mencari ID kelurahan bedasarkan nama
     */
    public function showByName($name)
    {
        $kelurahanId = DB::table('kelurahans')
            // Menggunakan REPLACE untuk membuang 'Kelurahan ' dari nama sebelum membandingkan.
            ->whereRaw("LOWER(REPLACE(name, 'Kelurahan ', '')) = ?", [strtolower($name)])
            ->value('id');

        if (!$kelurahanId) {
            return response()->json(['message' => 'Kelurahan not found'], 404);
        }

        return $this->show($kelurahanId);
    }
    /**
     * Tampilkan detail kelurahan dengan polygon
     */
    public function show($id)
    {
        $kelurahan = DB::table('kelurahans')
            ->select(
                'id',
                'name',
                'district_id',
                DB::raw('ST_AsGeoJSON(polygon) as polygon_geojson')
            )
            ->where('id', $id)
            ->first();

        if (!$kelurahan) {
            return response()->json(['message' => 'Kelurahan not found'], 404);
        }

        $kelurahan->polygon = json_decode($kelurahan->polygon_geojson);

        return response()->json($kelurahan);
    }

    public function list(){
        $kelurahans = DB::table('kelurahans')->get();
        return response()->json(['data' => $kelurahans]);
    }

    public function count(){
        return response()->json(['data' => DB::table('kelurahans')->count()]);
    }

    public function add(Request $request)
    {
        $kelurahanId = DB::table('kelurahans')->insertGetId(
            [
                'name'=> $request->input('name', null),
                'district_id' => $request->input('district_id', null),
                'polygon' => $request->input('polygon', null),
            ]
        );
        
         return response()->json([
            'message' => 'Kelurahan added successfully',
            'id'      => $kelurahanId
        ], 201);
    }

    public function edit(Request $request, $id)
    {
        $district = DB::table('kelurahans')->where('id', $id)->first();
        if (!$district) {
            return response()->json(['message' => 'Kelurahan not found'], 404);
        }

        $data = array_filter($request->all(), function($value) {
            return !is_null($value);
        });

        if(!isEmpty($data)){
            DB::table('kelurahans')->where('id', $id)->update($data);
        }

        return response()->json([
            'message' => 'Kelurahan updated successfully',
            'id' => $id
        ], 201);
    }

    public function delete($id)
    {
        $deleted = DB::table('kelurahans')->where('id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Kelurahan deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Kelurahan not found'], 404);
        }
    }
    
    public function showInfo($id)
    {
        $kelurahan = DB::table('kelurahans')
            ->select(
                'id',
                'name',
                'district_id',
            )
            ->where('id', $id)
            ->first();

        if (!$kelurahan) {
            return response()->json(['message' => 'Kelurahan not found'], 404);
        }

        return response()->json($kelurahan);
    }
}