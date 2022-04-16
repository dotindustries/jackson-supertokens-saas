import {v1} from '@authzed/authzed-node'
import {PartialMessage} from '@protobuf-ts/runtime'
import {
  CheckPermissionResponse_Permissionship
} from '@authzed/authzed-node/dist/src/authzedapi/authzed/api/v1/permission_service'

const token = process.env.PERMISSIONS_API_TOKEN
const prefix = process.env.PERMISSIONS_PREFIX
export type ObjectType = string & 'user' | 'org' | 'company'

export type SubjectType = ObjectType
export type ResourceType = ObjectType

if (!token) {
  throw new Error(`PERMISSIONS_API_TOKEN missing`)
}

const client = v1.NewClient(token)

export type Permission = string
export type Resource = { objectType: ResourceType } & PartialMessage<v1.ObjectReference>
export type Subject = { objectType: SubjectType } & PartialMessage<v1.ObjectReference>

export const checkPermission = (res: Resource, sub: Subject, permission: string) => {
  return new Promise<boolean>((resolve, reject) => {
    const resource = v1.ObjectReference.create({
      objectId: res.objectId,
      objectType: `${prefix}${res.objectType}`
    })

    const subject = v1.SubjectReference.create({
      object: v1.ObjectReference.create({
        objectType: `${prefix}${sub.objectType}`,
        objectId: sub.objectId
      })
    })

    const checkPermissionRequest = v1.CheckPermissionRequest.create({
      resource,
      permission,
      subject
    })

    client.checkPermission(checkPermissionRequest, (err, response) => {
      if (err) {
        reject(err.message)
        return
      }
      if (!response) {
        reject(false)
        return
      }
      if (response.permissionship === CheckPermissionResponse_Permissionship.HAS_PERMISSION) {
        resolve(true)
      }

      resolve(false)
    })
  })
}
