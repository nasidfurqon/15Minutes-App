<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PublicService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\isEmpty;

class PublicServiceController extends Controller
{
    public function index() {
        return response()->json(PublicService::all());
    }

    public function add(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:service_categories,id',
            'description' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'location' => 'required|array', // lat & lng
            'location.lat' => 'required|numeric',
            'location.lng' => 'required|numeric',
            'opening_hours' => 'nullable|string', // simpan JSON sebagai string
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_active' => 'nullable|boolean'
        ]);

        // Set default values "-"
        $data = [
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'description' => $validated['description'] ?? '-',
            'website' => $validated['website'] ?? '-',
            'phone' => $validated['phone'] ?? '-',
            'email' => $validated['email'] ?? '-',
            'address' => $validated['address'] ?? '-',
            'opening_hours' => $validated['opening_hours'] ?? '-',
            'rating' => $validated['rating'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ];

        // Konversi lokasi ke POINT (PostGIS)
        $lat = $validated['location']['lat'];
        $lng = $validated['location']['lng'];
        $data['location'] = DB::raw("ST_SetSRID(ST_MakePoint($lng, $lat), 4326)");

        $id = DB::table('public_services')->insertGetId($data);

        return response()->json([
            'message' => 'Service added successfully',
            'id' => $id
        ], 201);
    }


    public function edit(Request $request, $id)
    {
        $service = DB::table('public_services')->where('id', $id)->first();
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $data = array_filter($request->all(), function($value) {
            return !is_null($value);
        });

        if(!isEmpty($data)){
            DB::table('public_services')->where('id', $id)->update($data);
        }

        return response()->json([
            'message' => 'Service updated successfully',
            'id' => $id
        ], 201);
    }

    public function delete($id)
    {
        $deleted = DB::table('public_services')->where('id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Service deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Service not found'], 404);
        }
    }
    public function show($id) {
        return response()->json(PublicService::findOrFail($id));
    }

    public function list(){
        return response()->json(['data' => DB::table('public_services')->get()]);
    }

    public function count(){
        return response()->json(['data' => DB::table('public_services')->count()]);
    }
    
    public function update(Request $request, $id) {
        $service = PublicService::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:service_categories,id',
            'description' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'location' => 'nullable',
            'opening_hours' => 'nullable|json',
            'rating' => 'nullable|numeric|min:0|max:5',
            'is_active' => 'boolean'
        ]);

        $service->update($validated);
        return response()->json($service);
    }

    public function destroy($id) {
        $service = PublicService::findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function getInZone($search_id){
        $services = DB::table('public_services')
            ->join('walkability_zones', DB::raw('ST_Within(public_services.location, walkability_zones.zone_polygon)'), '=', DB::raw('true'))
            ->join('service_categories', 'public_services.category_id', '=', 'service_categories.id')
            ->where('walkability_zones.search_id', $search_id)
            ->select(
                'public_services.id',
                'public_services.name',
                'public_services.description',
                DB::raw('ST_Y(location::geometry) as lat'),
                DB::raw('ST_X(location::geometry) as lng'),
                'public_services.category_id',
                'service_categories.name as category_name'
            )
            ->get();

        return response()->json($services);
    }

}
